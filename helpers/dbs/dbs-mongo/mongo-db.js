const mongo = require('mongodb').MongoClient
const config = require('../../../config')
const common = require('../../utils/utils-common')
const log = require('../../utils/utils-logger')


// -------------------------------------------------
// DB Connection Variable
var conn


// -------------------------------------------------
// DB Get Connect Function
async function getConnection() {
 let dbURI = 'mongodb://' + config.schema.get('db.username') + ':' + config.schema.get('db.password') + '@' +
             config.schema.get('db.host') + ':' + config.schema.get('db.port') + '/' +
             config.schema.get('db.name')

  const dbOptions = {
    poolSize: 50,    
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true
  }

  try {
    conn = await mongo.connect(dbURI, dbOptions)

    if (! await getPing()) {
      log.send('mongo-db-get-connection').error("Cannot Get Mongo Database Ping")
      process.exit(1)
    }
  } catch(err) {
    log.send('mongo-db-get-connection').error("Cannot Get Mongo Database Connection")
    process.exit(1)
  }
}


// -------------------------------------------------
// DB Get Ping Function
async function getPing() {
  try {
    let status = await conn.db.admin().command({ ping: 1 })

    if (status.ok === 1) {
      return true
    }
  } catch(err) {
    log.send('mongo-db-get-ping').error(common.strToTitleCase(err.message))
    return false
  }

  return false
}


// -------------------------------------------------
// Export Module
module.exports = {
  conn,
  getConnection,
  getPing
}