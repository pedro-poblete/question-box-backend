const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const db = require('./api/models/initialize.js')
db.createSchema()

const publicRoutes =  require('./api/routes/public')
const privateRoutes = require('./api/routes/privates')


app.use('/public', publicRoutes)
app.use('/private', privateRoutes)

app.listen(port, () => `App running in port ${port}`)
