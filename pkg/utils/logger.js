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
// Log Debug Function
function debug(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }

  logger.debug(logObj)
}


// -------------------------------------------------
// Log Information Function
function info(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }

  logger.info(logObj)
}


// -------------------------------------------------
// Log Notice Function
function notice(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }

  logger.notice(logObj)
}


// -------------------------------------------------
// Log Warning Function
function warn(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }
  logger.warn(logObj)
}


// -------------------------------------------------
// Log Error Function
function error(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }
  logger.error(logObj)
}


// -------------------------------------------------
// Log Critical Function
function crit(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }
  logger.crit(logObj)
}


// -------------------------------------------------
// Log Alert Function
function alert(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }
  logger.alert(logObj)
}


// -------------------------------------------------
// Log Emergency Function
function emerg(label, message) {
  const logObj = {
    time: moment().tz(config.schema.get('timezone')).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
    service: package.name,
    label: label,
    message: message
  }
  logger.emerg(logObj)
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
