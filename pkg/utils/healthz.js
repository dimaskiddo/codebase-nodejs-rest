const config = require ('../config')
const response = require('./response')
const log = require('./logger')

const dbMongo = require('../databases/mongo/dbs')
const dbMySQL = require('../databases/mysql/dbs')


// -------------------------------------------------
// Health Check Function
async function healthCheck(res) {
  switch (config.schema.get('db.driver')) {
    case 'mongo':
      if (! dbMongo.getPing()) {
        log.error('service-health', 'Cannot Get Mongo Database Ping')
        response.resInternalError(res, 'Cannot Get Mongo Database Ping')
        return
      }
      break
    case 'mysql':
      if (! dbMySQL.getPing()) {
        log.error('service-health', 'Cannot Get MySQL Database Ping')
        response.resInternalError(res, 'Cannot Get MySQL Database Ping')
        return
      }
      break
  }

  response.resSuccess(res, 'Service is Healthy')
}


// -------------------------------------------------
// Export Module
module.exports = {
  healthCheck
}
