const mysql = require('mysql')
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
    try {
      session = await mysql.createPool({
        host: config.schema.get('db.host'),
        port: config.schema.get('db.port'),
        user: config.schema.get('db.username'),
        password: config.schema.get('db.password'),
        database: config.schema.get('db.name'),
        timezone: config.schema.get('timezone')
      })

      conn = await new Promise(function (resolve, reject) {
        session.getConnection(function (err, connection) {
          if (err) reject(err)
          resolve(connection)
        })
      })

      if (! await getPing()) {
        log.send('mysql-db-get-connection').error('Cannot Get MySQL Database Ping')
        process.exit(1)
      }

      return conn
    } catch(err) {
      log.send('mysql-db-get-connection').error(common.strToTitleCase(err.message))
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
    let dbStatus = false
    
    if (conn !== undefined) {
      dbStatus = await new Promise(function (resolve, reject) {
        conn.ping(function (err) {
          if (err) reject(false)
          resolve(true)
        })
      })
    }

    return dbStatus
  } catch(err) {
    log.send('mysql-db-get-ping').error(common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB Close Connection Function
function closeConnection(){
  try {
    if (session !== undefined) {
      session.end(function (err) {
        if (err) throw(err)
      })
    }

    log.send('mysql-db-close-connection').error('Successfully Close MySQL Database Session')
  } catch(err) {
    log.send('mysql-db-close-connection').error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  getPing,
  closeConnection
}