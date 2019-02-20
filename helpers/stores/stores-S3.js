const minio = require('minio')
const config = require('../../config')
const common = require('../utils/utils-common')
const log = require('../utils/utils-logger')


// -------------------------------------------------
// Store Connection Variable
var conn


// -------------------------------------------------
// Store Get Connection Function
function getConnection() {
  if (conn === undefined) {
    switch (config.schema.get('store.driver')) {
      case 'aws':
        conn = new minio.Client({
          endPoint: 's3.amazonaws.com',
          accessKey: config.schema.get('store.accessKey'),
          secretKey: config.schema.get('store.secretKey')
        })

        return conn
      case 'minio':
        conn = new minio.Client({
          endPoint: config.schema.get('store.endPoint'),
          accessKey: config.schema.get('store.accessKey'),
          secretKey: config.schema.get('store.secretKey'),
          port: config.schema.get('store.port'),
          useSSL: config.schema.get('store.useSSL')
        })

        return conn
    }
  } else {
    return conn
  }
}


// -------------------------------------------------
// Store Add File Upload Function
async function addFileUpload(fileName, fileBuffer) {
  try {
    if (conn !== undefined) {
      let bucketName = config.schema.get('store.bucket')
      let bucketExist = await conn.bucketExist(bucketName)

      if (bucketExist) {
        let errPutObject = await conn.putObject(bucketName, fileName, fileBuffer)

        if (errPutObject) {
          log.send('store-s3-add-file-upload').error('Failed To Put Object')
          return false
        }

        log.send('store-s3-add-file-upload').info('Successfully Put Object ' + fileName)
        return true
      } else {
        log.send('store-s3-add-file-upload').error('Failed Get Bucket')
        return false
      }
    }

    log.send('store-s3-add-file-upload').error('Cannot Get Store Connection')
    return false
  } catch(err) {
    log.send('mongo-db-get-ping').error(common.strToTitleCase(err.message))
    return false
  }
}

 
// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  addFileUpload
}