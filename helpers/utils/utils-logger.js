const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format

const config = require('../../config')
const package = require('../../package.json')


// -------------------------------------------------
// Log Schema Constant
const schema = printf(({ level, message, label, timestamp, service }) => {
  return `{"timestamp":"${timestamp}","level":"${level}","service":"${service}","label":"${label}",message":"${message}"}`
})


// -------------------------------------------------
// Log Send Constant
const send = (labelTag) => createLogger({
  format: combine(
    label({ label: labelTag }),
    timestamp(),
    schema
  ),
  defaultMeta: { service: package.name },
  transports: [
    new transports.Console({
      level: config.schema.get('log.level'),
      handleExceptions: true,
      json: true,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
})


// -------------------------------------------------
// Export Module
module.exports = {
  send
}
