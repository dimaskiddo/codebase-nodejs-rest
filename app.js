const helmet = require('helmet')
const logger = require('morgan')
const express = require('express')
const common = require('./helpers/utils/utils-common')
const response = require('./helpers/utils/utils-response')
const app = express()


// -------------------------------------------------
// Express Module
app.use(helmet())
app.use(logger('dev'))

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
app.use(function (req, res, next) {
  response.resNotFound(res)
})

app.use(function (err, req, res, next) {
  response.resInternalError(res, common.strToTitleCase(err.message))
})


// -------------------------------------------------
// Export Module
module.exports = app
