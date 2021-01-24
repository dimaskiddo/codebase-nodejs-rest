const env = require('dotenv')

const convict = require('convict')
const convictValidator = require('convict-format-with-validator')

const package = require('../package.json')


// -------------------------------------------------
// Configuration Schema Constant
convict.addFormat(convictValidator.ipaddress)
const schema = convict({
  env: {
    doc: 'The Application Environment',
    format: ['development', 'production', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  workers: {
    doc: 'The Application Workers Number',
    format: Number,
    default: 1,
    env: 'NODE_WORKERS'
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
    },
    upload: {
      path: {
        doc: 'The Application Upload Path',
        format: String,
        default: './misc/public/uploads',
        env: 'NODE_SERVER_UPLOAD_PATH'
      },
      limit: {
        doc: 'The Application Upload Limit Size',
        format: Number,
        default: 8,
        env: 'NODE_SERVER_UPLOAD_LIMIT'
      },
      max: {
        doc: 'The Application Upload Maximum Simultaneous',
        format: Number,
        default: 10,
        env: 'NODE_SERVER_UPLOAD_MAX'
      }
    },
    keys: {
      private: {
        doc: 'The Application Private Key Path',
        format: String,
        default: './misc/keys/private.key',
        env: 'NODE_SERVER_KEYS_PRIVATE'
      },
      public: {
        doc: 'The Application Public Key Path',
        format: String,
        default: './misc/keys/public.key',
        env: 'NODE_SERVER_KEYS_PUBLIC'
      }
    },
    cors: {
      origins: {
        doc: 'The Application CORS Origins',
        format: String,
        default: '*',
        env: 'NODE_SERVER_CORS_ORIGINS'
      },
      methods: {
        doc: 'The Application CORS Methods',
        format: String,
        default: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        env: 'NODE_SERVER_CORS_METHODS'
      },
      headers: {
        doc: 'The Application CORS Headers',
        format: String,
        default: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        env: 'NODE_SERVER_CORS_HEADERS'
      }
    }
  },
  log: {
    level: {
      doc: 'The Application Log Level',
      format: ['debug', 'verbose', 'info', 'warn', 'error'],
      default: 'info',
      env: 'NODE_LOG_LEVEL'
    },
    logstash: {
      node: {
        doc: 'The Application Log Logstash Node',
        format: String,
        default: '',
        env: 'NODE_LOG_LOGSTASH_NODE'
      },
      host: {
        doc: 'The Application Log Logstash Host',
        format: String,
        default: '127.0.0.1',
        env: 'NODE_LOG_LOGSTASH_HOST'
      },
      port: {
        doc: 'The Application Log Logstash Port',
        format: 'port',
        default: 5000,
        env: 'NODE_LOG_LOGSTASH_PORT'
      }
    }
  },
  timezone: {
    doc: 'The Application Timezone',
    format: String,
    default: 'Asia/Jakarta',
    env: 'NODE_TIMEZONE'
  },
  jwt: {
    issuer: {
      doc: 'JWT Issuer',
      format: String,
      default: package.name,
      env: 'JWT_ISSUER'
    },
    audience: {
      doc: 'JWT Audience',
      format: String,
      default: '1f3730ca-776a-4420-ad17-cf0acb31d10c',
      env: 'JWT_EXPIRED'
    },
    expired: {
      doc: 'JWT Expiration',
      format: String,
      default: '1d',
      env: 'JWT_EXPIRED'
    },
    refresh: {
      doc: 'JWT Refresh Expiration',
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
      default: true,
      env: 'STORE_USE_SSL'
    },
    expired: {
      doc: 'Storage Private URL Expiration',
      format: Number,
      default: 60,
      env: 'STORE_URL_EXPIRED'
    }
  }
})

schema.loadFile('./misc/configs/' + schema.get('env')  + '.json')
schema.validate({allowed: 'strict'})
env.config()


// -------------------------------------------------
// Export Module
module.exports = {
  schema
}
