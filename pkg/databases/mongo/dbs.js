const mongo = require('mongodb').MongoClient
const config = require('../../config')

const common = require('../../utils/common')
const log = require('../../utils/logger')


// -------------------------------------------------
// DB Connection Variable
var dbPool, dbConnenction


// -------------------------------------------------
// DB Get Connection Function
async function getConnection() {
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

    try {
      dbPool = await mongo.connect(dbURI, dbOptions)

      if (! dbPool.isConnected()){
        log.send('mongo-db-get-connection').error('Cannot Get Mongo Database Connection')
        process.exit(1)
      }

      dbConnenction = dbPool.db(config.schema.get('db.name'))

      if (! await getPing()) {
        log.send('mongo-db-get-connection').error('Cannot Get Mongo Database Ping')
        process.exit(1)
      }

      return dbConnenction
    } catch(err) {
      log.send('mongo-db-get-connection').error(common.strToTitleCase(err.message))
      process.exit(1)
    }
  } else {
    return dbConnenction
  }
}


// -------------------------------------------------
// DB Get Ping Function
async function getPing() {
  try {
    if (dbPool !== undefined) {
      if (dbPool.isConnected()) {
        if (dbConnenction !== undefined) {
          let dbAdmin = dbConnenction.admin()  
          let dbStatus = await dbAdmin.ping()
          
          if (dbStatus.ok === 1) {
            return true
          }    
        }
      }
    }

    return false
  } catch(err) {
    log.send('mongo-db-get-ping').error(common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB Close Connection Function
function closeConnection(){
  try {
    if (dbPool !== undefined) {
      dbPool.close()
    }

    log.send('mongo-db-close-connection').error('Successfully Close Mongo Database Connection')
  } catch(err) {
    log.send('mongo-db-close-connection').error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  getPing,
  closeConnection
}
