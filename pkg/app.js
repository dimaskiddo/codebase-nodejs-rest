const express = require('express')
const helmet = require('helmet')

const config = require('./config')

const dbMongo = require('./databases/mongo/dbs')
const dbMySQL = require('./databases/mysql/dbs')

const storeS3 = require('./stores/S3')

const common = require('./utils/common')
const response = require('./utils/response')
const log = require('./utils/logger')

const app = express()
const ctx = 'service-main'

// -------------------------------------------------
// Database Module
switch (config.schema.get('db.driver')) {
  case 'mongo':
    dbMongo.getConnection()
    break
  case 'mysql':
    dbMySQL.getConnection()
    break
}


// -------------------------------------------------
// Store Module
switch (config.schema.get('store.driver')) {
  case 'aws', 'minio':
    storeS3.getConnection()
    break
}


// -------------------------------------------------
// Express Module
app.use(helmet())

app.use(express.json())

app.use(express.urlencoded({ 
  extended: false,
  limit: config.schema.get('server.upload.limit') + 'mb'
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.schema.get('server.cors.origins'))
  res.header('Access-Control-Allow-Methods', config.schema.get('server.cors.methods'))
  res.header('Access-Control-Allow-Headers', config.schema.get('server.cors.headers'))
  next()
})


// -------------------------------------------------
// Load Router Handler to Express Module
app.use('/', require('../internal/routes/index'))


// -------------------------------------------------
// Load Default Router Handler to Express Module
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(function (req, res) {
  log.warn(ctx, 'No Method ' + req.method + ' at URI ' + req.url)
  response.resNotFound(res, 'No Method ' + req.method + ' at URI ' + req.url)
})

app.use(function (err, req, res, next) {
  log.error(ctx, common.strToTitleCase(err.message))
  response.resInternalError(res, common.strToTitleCase(err.message))
})


// -------------------------------------------------
// Process On Terminate Function
function onTerminate() {
  // Handle Database Connection
  switch (config.schema.get('db.driver')) {
    case 'mongo':
      dbMongo.closeConnection()
      break
    case 'mysql':
      dbMySQL.closeConnection()
      break
  }

  // Gracefully Exit
  process.exit(0)
}

process.on('SIGTERM', onTerminate)
process.on('SIGINT', onTerminate)


// -------------------------------------------------
// Export Module
module.exports = app
