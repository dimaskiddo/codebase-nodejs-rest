const mysql = require('mysql')
const config = require('../../config')

const common = require('../../utils/common')
const log = require('../../utils/logger')


// -------------------------------------------------
// DB Connection Variable
var dbPool


// -------------------------------------------------
// DB Get Connection Function
function getConnection() {
  if (dbPool === undefined) {
    dbPool = mysql.createPool({
      host: config.schema.get('db.host'),
      port: config.schema.get('db.port'),
      user: config.schema.get('db.username'),
      password: config.schema.get('db.password'),
      database: config.schema.get('db.name'),
      timezone: config.schema.get('timezone')
    })

    if (! getPing()) {
      log.send('mysql-db-get-connection').error('Cannot Get MySQL Database Ping')
      process.exit(1)
    }
    
    return dbPool
  } else {
    return dbPool
  }
}


// -------------------------------------------------
// DB Get Ping Function
function getPing() {
  let ctx = 'mysql-db-get-ping'

  try {
    let dbStatus = false

    if (dbPool !== undefined) {
      dbStatus = new Promise(function(resolve, reject) {
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
    log.error(ctx, common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB Close Connection Function
function closeConnection(){
  let ctx = 'mysql-db-close-connection'

  try {
    if (dbPool !== undefined) {
      dbPool.end(function(err) {
        if (err) throw(err)
      })
    }

    log.error(ctx, 'Successfully Close MySQL Database Connection')
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