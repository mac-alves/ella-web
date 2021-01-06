import fs from 'fs'

export const config = {
  api: {
    bodyParser: true
  }
}

const uploadJson = next => (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(
        'public/upload/estimates.json',
        JSON.stringify(req.body),
        err => {
          if (err) {
            reject(err)
          }
        }
      )

      req.form = { msg: 'File uploaded successfully' }
      return resolve(next(req, res))
    } catch (error) {
      return resolve(res.status(403).send(error))
    }
  })
}

function handler(req, res) {
  try {
    if (req.method === 'POST') {
      res.status(200).send(req.form)
    } else {
      throw String('Method not allowed')
    }
  } catch (error) {
    res.status(400).json({ message: JSON.stringify(error, null, 2) })
  }
}

export default uploadJson(handler)
