const { createLogger, format, transports } = require('winston')
const { combine, printf } = format

const moment = require('moment-timezone')

const package = require('../../package.json')
const config = require('../config')


// -------------------------------------------------
// Log Schema Timestamp Constant
const schemaTimestamp = format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ')
  return info
})


// -------------------------------------------------
// Log Schema Format Constant
const schemaFormat = printf(({ level, message, label, timestamp, service }) => {
  return `${level}:
  > service   : ${service}
  > label     : ${label}
  > message   : ${message}
  > timestamp : ${timestamp}`
})


// -------------------------------------------------
// Log Send Constant
const send = (scope) => createLogger({
  format: combine(
    schemaTimestamp({ tz: config.schema.get('timezone') }),
    format.colorize(),
    format.simple(),
    schemaFormat,
  ),
  defaultMeta: {
    service: package.name,
    label: scope,
  },
  transports: [
    new transports.Console({
      level: config.schema.get('log.level'),
      handleExceptions: true
    })
  ],
  exitOnError: false
})


// -------------------------------------------------
// Export Module
module.exports = {
  send
}
