const mongo = require('mongodb').MongoClient
const config = require('../../config')

const common = require('../../utils/common')
const log = require('../../utils/logger')


// -------------------------------------------------
// DB Connection Variable
var dbPool, dbConnenction


// -------------------------------------------------
// DB Get Connection Function
function getConnection() {
  let ctx = 'mongo-db-get-connection'

  if (dbConnenction === undefined) {
    let dbURI

    if (config.schema.get('db.username') === '' || config.schema.get('db.password') === '') {
      dbURI = 'mongodb://' + config.schema.get('db.host') + ':' + config.schema.get('db.port')
    } else {
      dbURI = 'mongodb://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
              config.schema.get('db.host') + ':' + config.schema.get('db.port') + '/' + config.schema.get('db.name')
    }
    
    const dbOptions = {
      poolSize: 50,    
      keepAlive: 15000,
      socketTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      useNewUrlParser: true
    }

    dbPool = mongo.connect(dbURI, dbOptions)

    if (! dbPool.isConnected()) {
      log.error(ctx, 'Cannot Get Mongo Database Connection')
      process.exit(1)
    }

    dbConnenction = dbPool.db(config.schema.get('db.name'))

    if (! getPing()) {
      log.error(ctx, 'Cannot Get Mongo Database Ping')
      process.exit(1)
    }

    return dbConnenction
  } else {
    return dbConnenction
  }
}


// -------------------------------------------------
// DB Get Ping Function
function getPing() {
  let ctx = 'mongo-db-get-ping'

  try {
    if (dbPool !== undefined) {
      if (dbPool.isConnected()) {
        if (dbConnenction !== undefined) {
          let dbAdmin = dbConnenction.admin()  
          let dbStatus = dbAdmin.ping()
          
          if (dbStatus.ok === 1) {
            return true
          }    
        }
      }
    }

    return false
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB Close Connection Function
function closeConnection(){
  let ctx = 'mongo-db-close-connection'

  try {
    if (dbPool !== undefined) {
      dbPool.close()
    }

    log.error(ctx, 'Successfully Close Mongo Database Connection')
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  getPing,
  closeConnection
}
