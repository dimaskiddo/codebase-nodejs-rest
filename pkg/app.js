const express = require('express')
const expressUA = require('express-useragent')
const helmet = require('helmet')

const config = require('./config')

const dbMongo = require('./databases/mongo/dbs')
const dbMySQL = require('./databases/mysql/dbs')

const storeS3 = require('./stores/S3')

const common = require('./utils/common')
const response = require('./utils/response')
const log = require('./utils/logger')

const app = express()
const ctx = 'http-server'


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

app.use(expressUA.express())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.schema.get('server.cors.origins'))
  res.header('Access-Control-Allow-Methods', config.schema.get('server.cors.methods'))
  res.header('Access-Control-Allow-Headers', config.schema.get('server.cors.headers'))

  if (req.url !== '/favicon.ico') {
    const logData = {
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      system: req.useragent.platform + '/' + req.useragent.os,
      agent: req.useragent.browser + '/' + req.useragent.version
    }
  
    log.info(ctx, logData)
  }

  next()
})


// -------------------------------------------------
// Load Router Handler to Express Module
app.use('/', require('../internal/routes/index'))


// -------------------------------------------------
// Load Default Router Handler to Express Module
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(function (req, res) {
  const logData = {
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
    method: req.method,
    url: req.url,
    system: req.useragent.platform + '/' + req.useragent.os,
    agent: req.useragent.browser + '/' + req.useragent.version,
    error: 'Not Found'
  }

  log.warn(ctx, logData)
  response.resNotFound(res, logData.error)
})

app.use(function (err, req, res, next) {
  const logData = {
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
    method: req.method,
    url: req.url,
    system: req.useragent.platform + '/' + req.useragent.os,
    agent: req.useragent.browser + '/' + req.useragent.version,
    error: common.strToTitleCase(err.message)
  }

  log.error(ctx, logData)
  response.resInternalError(res, logData.error)
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
