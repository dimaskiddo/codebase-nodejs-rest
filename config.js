const env = require('dotenv')
const convict = require('convict')


// -------------------------------------------------
// Configuration Schema Variable
var schema = convict({
  env: {
    doc: 'The application environment',
    format: ['dev', 'prod', 'test'],
    default: 'dev',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The application port',
    format: 'port',
    default: 3000,
    env: 'NODE_PORT'
  },
  db: {
    driver: {
      doc: 'Database Driver',
      format: String,
      default: '',
      env: "DB_DRIVER"
    },
    host: {
      doc: 'Database Host',
      format: '*',
      default: '',
      env: "DB_HOST"
    },
    port: {
      doc: "Database Port",
      format: 'port',
      default: '',
      env: "DB_PORT"
    },
    username: {
      doc: "Database Username",
      format: String,
      default: '',
      env: "DB_USERNAME"
    },
    password: {
      doc: "Database Password",
      format: String,
      default: '',
      env: "DB_PASSWORD"
    },
    name: {
      doc: "Database Name",
      format: String,
      default: '',
      env: "DB_NAME"
    }
  }
})
schema.loadFile('./configs/' + schema.get('env')  + '.json')
schema.validate({allowed: 'strict'})
env.config()


// -------------------------------------------------
// Export Module
module.exports = {
  schema
}
