import { NowRequest, NowResponse } from '@vercel/node'
import { MongoClient, Db } from 'mongodb'
import { URL } from 'url'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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

const register = async (data: any): Promise<Result> => {
  try {
    if (data.secret !== process.env.SECRET) {
      throw String('Not authorized')
    }

    if (!data.user || !data.password) {
      throw String('Empty user and / or passwords')
    }

    const hash = await bcrypt.hash(data.password, 10)

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('auth')
    await collection.updateOne(
      {},
      {
        $set: {
          user: data.user,
          password: hash
        }
      },
      { upsert: true }
    )

    return {
      cod: 201,
      msg: 'Created user',
      error: null,
      data: null
    }
  } catch (error) {
    return { cod: 400, msg: 'Error registering user', error, data: null }
  }
}

const login = async (data: any): Promise<Result> => {
  try {
    if (!data.user || !data.password) {
      throw String('Empty user and / or passwords')
    }

    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = db.collection('auth')
    const auth = await collection.findOne({})

    const passIsValid = await bcrypt.compare(data.password, auth.password)

    if (data.user !== auth.user || !passIsValid) {
      throw String('Credentials do not match')
    }

    const id = Number(auth._id)
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300 // expires in 5min
    })

    return {
      cod: 200,
      msg: 'Successful login.',
      error: null,
      data: { token }
    }
  } catch (error) {
    return { cod: 401, msg: 'Invalid login.', error, data: null }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req: NowRequest, res: NowResponse) => {
  try {
    const actions = {
      POST: (data: any) => login(data),
      PUT: (data: any) => register(data)
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
