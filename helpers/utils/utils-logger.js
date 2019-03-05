const moment = require('moment-timezone')
const { createLogger, format, transports } = require('winston')
const { combine, label, printf } = format

const config = require('../../config')
const package = require('../../package.json')


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
  return `{"label":"${label}","level":"${level}","msg":"${message}","service":"${service}","time":"${timestamp}"`
})


// -------------------------------------------------
// Log Send Constant
const send = (labelTag) => createLogger({
  format: combine(
    label({ label: labelTag }),
    schemaTimestamp({ tz: config.schema.get('timezone') }),
    schemaFormat
  ),
  defaultMeta: { service: package.name },
  transports: [
    new transports.Console({
      level: config.schema.get('log.level'),
      handleExceptions: true,
      json: true,
      colorize: false
    })
  ],
  exitOnError: false
})


// -------------------------------------------------
// Export Module
module.exports = {
  send
}
