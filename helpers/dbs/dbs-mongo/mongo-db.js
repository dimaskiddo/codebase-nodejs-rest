const mongo = require('mongodb').MongoClient
const config = require('../../../config')

const common = require('../../utils/utils-common')
const log = require('../../utils/utils-logger')


// -------------------------------------------------
// DB Connection Variable
var session, conn


// -------------------------------------------------
// DB Get Connection Function
async function getConnection() {
  if (conn === undefined) {
    let dbURI

    if (config.schema.get('db.username') !== '' || config.schema.get('db.password') !== '') {
      dbURI = 'mongodb://' + config.schema.get('db.host') + ':' + config.schema.get('db.port')
    } else {
      dbURI = 'mongodb://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
              config.schema.get('db.host') + ':' + config.schema.get('db.port')
    }

    const dbOptions = {
      poolSize: 50,    
      keepAlive: 15000,
      socketTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      useNewUrlParser: true
    }

    try {
      if (dbURI !== undefined) {
        session = await mongo.connect(dbURI, dbOptions)
        
        if (! session.isConnected()) {
          log.send('mongo-db-get-connection').error('Cannot Get Mongo Database Session')
          process.exit(1)
        }

        conn = session.db(config.schema.get('db.name'))

        if (! await getPing()) {
          log.send('mongo-db-get-connection').error('Cannot Get Mongo Database Ping')
          process.exit(1)
        }

        return conn
      } else {
        log.send('mongo-db-get-connection').error('Cannot Get Mongo Database URI')
        process.exit(1)
      }
    } catch(err) {
      log.send('mongo-db-get-connection').error(common.strToTitleCase(err.message))
      process.exit(1)
    }
  } else {
    return conn
  }
}


// -------------------------------------------------
// DB Get Ping Function
async function getPing() {
  try {
    if (conn !== undefined) {
      let dbAdmin = conn.admin()  
      let dbStatus = await dbAdmin.ping()
      
      if (dbStatus.ok === 1) {
        return true
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
    if (session !== undefined) {
      session.close()
    }

    log.send('mongo-db-close-connection').error('Successfully Close Mongo Database Session')
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
