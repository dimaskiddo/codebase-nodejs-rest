const moment = require('moment-timezone')

const { createLogger, format, transports, winston } = require('winston')
const { combine } = format
require('winston-logstash')

const package = require('../../package.json')
const config = require('../config')


// -------------------------------------------------
// Inject Winston Logstash Transport
if (config.schema.get('log.logstash.node') !== '' &&
    config.schema.get('log.logstash.host') !== '' &&
    config.schema.get('log.logstash.port') !== '') {
  
  winston.add(winston.transports.Logstash, {
    node_name: config.schema.get('log.logstash.node'),
    host: config.schema.get('log.logstash.host'),
    port: config.schema.get('log.logstash.port')
  })
}


// -------------------------------------------------
// Log Schema Timestamp Constant
const schemaTimestamp = format((info, opts) => {
  if (opts.tz)
    info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ')
  return info
})


// -------------------------------------------------
// Log Send Constant
const send = (label) => createLogger({
  format: combine(
    schemaTimestamp({ tz: config.schema.get('timezone') }),
    format.logstash(),
  ),
  defaultMeta: {
    service: package.name,
    label: label,
  },
  transports: [
    new transports.Console({
      level: config.schema.get('log.level'),
      handleExceptions: true,
      json: true,
      colorize: false,
    })
  ],
  exitOnError: false
})


// -------------------------------------------------
// Export Module
module.exports = {
  send
}
