const config = require ('../../config')
const response = require('./utils-response')
const log = require('./utils-logger')

const dbMongo = require('../dbs/dbs-mongo/mongo-db')


// -------------------------------------------------
// Health Check Function
async function healthCheck(res) {
  switch (config.schema.get('db.driver')) {
    case 'mongo':
      if (! await dbMongo.getPing()) {
        log.send('service-health').error('Cannot Get Mongo Database Ping')
        response.resInternalError(res, 'Cannot Get Mongo Database Ping')
        return
      }
      break
    case 'mysql':
      break
  }

  response.resSuccess(res, 'Service is Healthy')
}


// -------------------------------------------------
// Export Module
module.exports = {
  healthCheck
}
