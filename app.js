const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const config = require('./config')
const dbMongo = require('./helpers/dbs/dbs-mongo/mongo-db')
const common = require('./helpers/utils/utils-common')
const response = require('./helpers/utils/utils-response')
const log = require('./helpers/utils/utils-logger')
const app = express()


// -------------------------------------------------
// Database Module
switch (config.schema.get('db.driver')) {
  case "mongo":
    if (dbMongo.conn === undefined) {
      dbMongo.getConnection()
    }
    break;
  case "mysql":
    break;
}


// -------------------------------------------------
// Express Module
app.use(helmet())
app.use(morgan('combined'))

app.use(express.json())
app.use(express.urlencoded({ 
  extended: false
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})


// -------------------------------------------------
// Load Router Handler to Express Module
app.use('/', require('./routes/index'))


// -------------------------------------------------
// Load Default Router Handler to Express Module
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(function (req, res, next) {
  log.send('http-access').error("Request Not Found at " + req.url)
  response.resNotFound(res, "Request Not Found at " + req.url)
})

app.use(function (err, req, res, next) {
  log.send('http-access').error(common.strToTitleCase(err.message))
  response.resInternalError(res, common.strToTitleCase(err.message))
})


// -------------------------------------------------
// Export Module
module.exports = app
