const env = require('dotenv')
const convict = require('convict')


// -------------------------------------------------
// Configuration Schema Constant
const schema = convict({
  env: {
    doc: 'The Application Environment',
    format: ['dev', 'prod', 'test'],
    default: 'dev',
    env: 'NODE_ENV'
  },
  server: {
    address: {
      doc: 'The Application Address to Listen',
      format: 'ipaddress',
      default: '0.0.0.0',
      env: 'NODE_SERVER_ADDRESS'
    },
    port: {
      doc: 'The Application Port to Listen',
      format: 'port',
      default: 3000,
      env: 'NODE_SERVER_PORT'
    }
  },
  log: {
    level: {
      doc: 'The Application Log Level',
      format: ['debug', 'verbose', 'info', 'warn', 'error'],
      default: 'info',
      env: 'NODE_LOG_LEVEL'
    }
  },
  jwt: {
    expired: {
      doc: 'JWT Authentication Expiration',
      format: String,
      default: '1d',
      env: 'JWT_EXPIRED'
    }
  },
  db: {
    driver: {
      doc: 'Database Driver',
      format: String,
      default: '',
      env: 'DB_DRIVER'
    },
    host: {
      doc: 'Database Host',
      format: '*',
      default: '',
      env: 'DB_HOST'
    },
    port: {
      doc: 'Database Port',
      format: 'port',
      default: '',
      env: 'DB_PORT'
    },
    username: {
      doc: 'Database Username',
      format: String,
      default: '',
      env: 'DB_USERNAME'
    },
    password: {
      doc: 'Database Password',
      format: String,
      default: '',
      env: 'DB_PASSWORD'
    },
    name: {
      doc: 'Database Name',
      format: String,
      default: '',
      env: 'DB_NAME'
    }
  },
  store: {
    driver: {
      doc: 'Storage Driver',
      format: String,
      default: '',
      env: 'STORE_DRIVER'
    },
    endPoint: {
      doc: 'Storage Endpoint',
      format: String,
      default: '',
      env: 'STORE_ENDPOINT'
    },
    accessKey: {
      doc: 'Storage Access Key',
      format: String,
      default: '',
      env: 'STORE_ACCESS_KEY'
    },
    secretKey: {
      doc: 'Storage Secret Key',
      format: String,
      default: '',
      env: 'STORE_SECRET_KEY'
    },
    region: {
      doc: 'Storage Region',
      format: String,
      default: 'us-east-1',
      env: 'STORE_REGION'
    },
    bucket: {
      doc: 'Storage Bucket',
      format: String,
      default: '',
      env: 'STORE_BUCKET'
    },
    port: {
      doc: 'Storage Port',
      format: 'port',
      default: 443,
      env: 'STORE_PORT'
    },
    useSSL: {
      doc: 'Storage Use SSL',
      format: Boolean,
      default: false,
      env: 'STORE_USE_SSL'
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
