require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const db = require('./api/models/DBController.js')
db.initialize()
db.checkAdmins()

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

const questionsRoutes =  require('./api/routes/questions')
const userRoutes = require('./api/routes/users')

app.use('/questions', questionsRoutes)
app.use('/users', userRoutes)

app.listen( port, console.log(`App running in port ${port}`) )

module.exports = app; // for testing
