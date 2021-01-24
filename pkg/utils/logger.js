const winston = require('winston')
require('winston-logstash')

const moment = require('moment-timezone')

const package = require('../../package.json')
const config = require('../config')


// -------------------------------------------------
// Log Logger Constant
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.schema.get('log.level'),
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
  exitOnError: false
})


// -------------------------------------------------
// Log Logger Inject Winston Logstash
if (config.schema.get('log.logstash.node') !== '' &&
    config.schema.get('log.logstash.host') !== '' &&
    config.schema.get('log.logstash.port') !== '') {
  
  logger.add(winston.transports.Logstash, {
    node_name: config.schema.get('log.logstash.node'),
    host: config.schema.get('log.logstash.host'),
    port: config.schema.get('log.logstash.port')
  })
}


// -------------------------------------------------
// Log Meta Constant
const meta = {
  time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
  service: package.name
}


// -------------------------------------------------
// Log Debug Function
function debug(label, message) {
  const logData = {
    meta,
    label,
    message
  }

  logger.debug(logData)
}


// -------------------------------------------------
// Log Information Function
function info(label, message) {
  const logData = {
    meta,
    label,
    message
  }

  logger.info(logData)
}


// -------------------------------------------------
// Log Notice Function
function notice(label, message) {
  const logData = {
    meta,
    label,
    message
  }

  logger.notice(logData)
}


// -------------------------------------------------
// Log Warning Function
function warn(label, message) {
  const logData = {
    meta,
    label,
    message
  }
  logger.warn(logData)
}


// -------------------------------------------------
// Log Error Function
function error(label, message) {
  const logData = {
    meta,
    label,
    message
  }
  logger.error(logData)
}


// -------------------------------------------------
// Log Critical Function
function crit(label, message) {
  const logData = {
    meta,
    label,
    message
  }
  logger.crit(logData)
}


// -------------------------------------------------
// Log Alert Function
function alert(label, message) {
  const logData = {
    meta,
    label,
    message
  }
  logger.alert(logData)
}


// -------------------------------------------------
// Log Emergency Function
function emerg(label, message) {
  const logData = {
    meta,
    label,
    message
  }
  logger.emerg(logData)
}


// -------------------------------------------------
// Export Module
module.exports = {
  debug,
  info,
  notice,
  warn,
  error,
  crit,
  alert,
  emerg
}
