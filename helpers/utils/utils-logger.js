const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label } = format


// -------------------------------------------------
// Log Format Schema Variable
var fmt = createLogger({
    format: combine(
      label({ label: 'todo-service-log' }),
      timestamp(),
      format.json()
    ),
    defaultMeta: { service: 'todo-service' },
    transports: [
      new transports.Console({
        level: 'info',
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
  fmt
}
