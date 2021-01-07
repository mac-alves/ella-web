import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb'
import { URL } from 'url'

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

    if (actions[req.method]) {
      const info = await actions[req.method](req.body)

      return res
        .status(info.cod)
        .json({ msg: info.msg, error: info.error, data: info.data })
    } else {
      throw String('Method not allowed')
    }
  } catch (error) {
    res.status(400).json({ message: JSON.stringify(error, null, 2) })
  }
}
