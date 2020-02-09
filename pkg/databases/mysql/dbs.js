const mysql = require('mysql')
const config = require('../../config')

const common = require('../../utils/common')
const log = require('../../utils/logger')


// -------------------------------------------------
// DB Connection Variable
var dbPool


// -------------------------------------------------
// DB Get Connection Function
async function getConnection() {
  if (dbPool === undefined) {
    try {
      dbPool = await mysql.createPool({
        host: config.schema.get('db.host'),
        port: config.schema.get('db.port'),
        user: config.schema.get('db.username'),
        password: config.schema.get('db.password'),
        database: config.schema.get('db.name'),
        timezone: config.schema.get('timezone')
      })

      if (! await getPing()) {
        log.send('mysql-db-get-connection').error('Cannot Get MySQL Database Ping')
        process.exit(1)
      }
      
      return dbPool
    } catch(err) {
      log.send('mysql-db-get-connection').error(common.strToTitleCase(err.message))
      process.exit(1)
    }
  } else {
    return dbPool
  }
}


// -------------------------------------------------
// DB Get Ping Function
async function getPing() {
  try {
    let dbStatus = false

    if (dbPool !== undefined) {
      dbStatus = await new Promise(function(resolve, reject) {
        dbPool.getConnection(function(err, dbConn) {
          if (err) reject(err)

          if (dbConn !== undefined) {
            dbConn.ping(function(err) {
              if (err) reject(err)
              resolve(true)
            })
              
            dbConn.release()
          }
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
    if (dbPool !== undefined) {
      dbPool.end(function(err) {
        if (err) throw(err)
      })
    }

    log.send('mysql-db-close-connection').error('Successfully Close MySQL Database Connection')
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