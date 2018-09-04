const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const db = require('./api/models/DBSetup.js')
db.initialize()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
} )

const publicRoutes =  require('./api/routes/public')
const privateRoutes = require('./api/routes/privates')

app.use('/public', publicRoutes)
app.use('/private', privateRoutes)

app.listen(port, () => console.log(`App running in port ${port}`))
