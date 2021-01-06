import Formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false
  }
}

const uploadFile = next => (req, res) => {
  return new Promise((resolve, reject) => {
    try {
      const form = new Formidable.IncomingForm({
        multiples: false,
        keepExtensions: true
      })

      form.parse(req, (err, fields, file) => {
        if (err) {
          reject(err)
        }

        try {
          const rawData = fs.readFileSync(file.file.path)

          fs.writeFileSync('public/upload/estimates.json', rawData, err => {
            if (err) {
              reject(err)
            }
          })

          req.form = { msg: 'File uploaded successfully' }
        } catch (error) {
          reject(err)
        }

        return resolve(next(req, res))
      })
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

export default uploadFile(handler)
