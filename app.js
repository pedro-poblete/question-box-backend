const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000

const db = require('./api/models/DBSetup.js')
db.initialize()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const publicRoutes =  require('./api/routes/public')
const privateRoutes = require('./api/routes/privates')

app.use('/public', publicRoutes)
app.use('/private', privateRoutes)

app.listen(port, () => console.log(`App running in port ${port}`))
