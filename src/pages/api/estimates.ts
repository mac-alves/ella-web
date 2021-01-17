import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb'
import { URL } from 'url'
import jwt from 'jsonwebtoken'

let cachedDb: Db = null

interface Result {
  cod: number
  msg: string
  error: any
  data: any
}

const connectToDatabase = async (uri: string) => {
  if (cachedDb) {
    return cachedDb
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const dbName = new URL(uri).pathname.substr(1)
  cachedDb = client.db(dbName)

  return cachedDb
}

const authorized = req => {
  const bearer = req.headers.authorization

  if (!bearer) {
    return { auth: false, msg: 'No token provided.' }
  }

  const token = bearer.split(' ')[1]

  try {
    jwt.verify(token, process.env.SECRET)
    return { auth: true, msg: 'Successful token.' }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { auth: false, msg: 'Token jwt expired.' }
    }

    return { auth: false, msg: 'Failed to authenticate token.' }
  }
}

const putEstimates = async (data: any): Promise<Result> => {
  try {
    if (!data) {
      throw String('There can be no empty data')
    }

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('estimates')
    await collection.updateOne({}, { $set: data }, { upsert: true })

    return {
      cod: 201,
      msg: 'Budgets sent successfully',
      error: null,
      data: null
    }
  } catch (error) {
    return { cod: 400, msg: 'Error saving budgets', error, data: null }
  }
}

const getEstimates = async (): Promise<Result> => {
  try {
    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('estimates')
    const data = await collection.findOne({})

    return {
      cod: 200,
      msg: 'Budgets sent successfully',
      error: null,
      data
    }
  } catch (error) {
    return { cod: 400, msg: 'Error saving budgets', error, data: null }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NowRequest, res: NowResponse) => {
  try {
    const actions = {
      POST: (data: any) => putEstimates(data),
      GET: () => getEstimates()
    }

    const auth = authorized(req)
    if (!auth.auth) {
      throw Object({ msg: auth.msg, redirect: true })
    }

    if (actions[req.method]) {
      const info = await actions[req.method](req.body)

      return res
        .status(info.cod)
        .json({ msg: info.msg, error: info.error, data: info.data })
    } else {
      throw Object({ msg: 'Method not allowed', redirect: false })
    }
  } catch (error) {
    res.status(400).json({
      msg: null,
      error: error.msg,
      data: { redirect: error.redirect }
    })
  }
}
