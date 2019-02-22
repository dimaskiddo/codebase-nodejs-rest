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

        break
      case 'minio':
        conn = new minio.Client({
          endPoint: config.schema.get('store.endPoint'),
          accessKey: config.schema.get('store.accessKey'),
          secretKey: config.schema.get('store.secretKey'),
          port: config.schema.get('store.port'),
          useSSL: config.schema.get('store.useSSL')
        })

        break
    }
  }
}


// -------------------------------------------------
// Store Add File Upload Function
async function addFileUpload(fileName, fileBuffer) {
  if (conn !== undefined) {
    try {
      let bucketName = config.schema.get('store.bucket')
      let bucketExist = await conn.bucketExist(bucketName)

      if (!bucketExist) {
        let bucketCreate = await conn.makeBucket(bucketName, config.schema.get('store.region'))
        
        if (bucketCreate) {
          log.send('store-s3-add-file-upload').info('Successfully Create Bucket ' + bucketName)
        } else {
          log.send('store-s3-add-file-upload').error('Failed To Get Bucket')
          return false  
        }
      }

      let errPutObject = await conn.putObject(bucketName, fileName, fileBuffer)

      if (errPutObject) {
        log.send('store-s3-add-file-upload').error('Failed To Put Object')
        return false
      }

      log.send('store-s3-add-file-upload').info('Successfully Put Object ' + fileName)
      return true
    } catch(err) {
      log.send('store-s3-add-file-upload').error(common.strToTitleCase(err.message))
      return false
    }
  } else {
    log.send('store-s3-add-file-upload').error('Cannot Get Store Connection')
    return false
  }
}


// -------------------------------------------------
// Store Get File URL Function
function getFileURL(fileName) {
  if (conn !== undefined) {
    switch (config.schema.get('store.driver')) {
      case 'aws':
        return 'https://s3-' + config.schema.get('store.region') + '.amazonaws.com/' + 
                config.schema.get('store.bucket') + '/' + fileName.replace(/ /g, '+')
      case 'minio':
        if (!config.schema.get('store.useSSL')) {
          return 'http://' + config.schema.get('store.endPoint') + '/' +
                  config.schema.get('store.bucket') + '/' + fileName
        }
        return 'https://' + config.schema.get('store.endPoint') + '/' +
                config.schema.get('store.bucket') + '/' + fileName
    }
  } else {
    log.send('store-s3-get-file-url').error('Cannot Get Store Connection')
    return false
  }
}

 
// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  addFileUpload,
  getFileURL
}
