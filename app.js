const helmet = require('helmet')
const express = require('express')
const config = require('./config')

const dbMongo = require('./helpers/dbs/dbs-mongo/mongo-db')
const dbMySQL = require('./helpers/dbs/dbs-mysql/mysql-db')

const storeS3 = require('./helpers/stores/stores-S3')

const common = require('./helpers/utils/utils-common')
const response = require('./helpers/utils/utils-response')
const log = require('./helpers/utils/utils-logger')

const app = express()


// -------------------------------------------------
// Database Module
switch (config.schema.get('db.driver')) {
  case 'mongo':
    if (dbMongo.conn === undefined) {
      dbMongo.getConnection()
    }
    break
  case 'mysql':
    break
}


// -------------------------------------------------
// Store Module
switch (config.schema.get('store.driver')) {
  case 'aws', 'minio':
    if (storeS3.conn === undefined) {
      storeS3.getConnection()
    }
    break
}


// -------------------------------------------------
// Express Module
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ 
  extended: false
}))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  if (req.url !== '/favicon.ico') {
    log.send('http-access').info('Access Method ' + req.method + ' at URI ' + req.url)
  }

  next()
})


// -------------------------------------------------
// Load Router Handler to Express Module
app.use('/', require('./routes/index'))


// -------------------------------------------------
// Load Default Router Handler to Express Module
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(function (req, res) {
  log.send('http-access').warn('Not Found Method ' + req.method + ' at URI ' + req.url)
  response.resNotFound(res, 'Not Found Method ' + req.method + ' at URI ' + req.url)
})

app.use(function (err, req, res) {
  log.send('http-access').error(common.strToTitleCase(err.message))
  response.resInternalError(res, common.strToTitleCase(err.message))
})



// -------------------------------------------------
// Handle Proccess Exit
process.on('SIGINT', function () {
  console.log('')
  
  // Handle Database Connection
  switch (config.schema.get('db.driver')) {
    case 'mongo':
      dbMongo.closeConnection()
      break
    case 'mysql':
      break
  }

  // Gracefully Exit
  process.exit(0)
})


// -------------------------------------------------
// Export Module
module.exports = app
