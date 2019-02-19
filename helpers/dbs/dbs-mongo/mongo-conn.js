const mongo = require('mongodb').MongoClient
const config = require('../../../config')
const common = require('../../utils/utils-common')
const logger = require('../../utils/utils-logger')


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
    keepAlive: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    useNewUrlParser: true
  }

  try {
    conn = await mongo.connect(dbURI, dbOptions)
    
    if (! getPing(conn)) {
      logger.fmt.error(common.strToTitleCase("Cannot Get Database Ping"))
      process.exit(1)
    }
  } catch(err) {
    logger.fmt.error(common.strToTitleCase("Cannot Get Database Connection"))
    process.exit(1)
  }
}


// -------------------------------------------------
// DB Get Ping Function
async function getPing(conn) {
  let status = await conn.db.admin().command({ ping: 1 })

  if (status.ok === 1) {
    return true
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