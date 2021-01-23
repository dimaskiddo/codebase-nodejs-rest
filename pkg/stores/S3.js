const fs = require('fs')

const minio = require('minio')
const config = require('../config')

const common = require('../utils/common')
const log = require('../utils/logger')


// -------------------------------------------------
// Store Connection Variable
var connection


// -------------------------------------------------
// Store Get Connection Function
function getConnection() {
  if (connection === undefined) {
    switch (config.schema.get('store.driver')) {
      case 'aws':
        connection = new minio.Client({
          endPoint: 's3.amazonaws.com',
          accessKey: config.schema.get('store.accessKey'),
          secretKey: config.schema.get('store.secretKey')
        })

        break
      case 'minio':
        connection = new minio.Client({
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
async function addFileUpload(bucketName, fileName, filePath) {
  let ctx = 'store-s3-add-file-upload'

  if (connection !== undefined) {
    try {
      let bucketExist = await new Promise(function(resolve, reject) {
        connection.bucketExists(bucketName, function(err) {
          if (err) reject(false)
          resolve(true)
        })
      })

      if (!bucketExist) {
        let bucketCreate = await new Promise(function(resolve, reject) {
          connection.makeBucket(bucketName, config.schema.get('store.region'), function(err) {
            if (err) reject(false)
            resolve(true)
          })
        })

        if (bucketCreate) {
          log.info(ctx, 'Successfully Create Bucket ' + bucketName)
        } else {
          log.error(ctx, 'Failed To Get Bucket')
          return false  
        }
      }

      await connection.fPutObject(bucketName, common.strSpaceToUnderscore(fileName), filePath)
      fs.unlinkSync(filePath)

      log.info(ctx, 'Successfully Put Object \'' + fileName + '\'')
      return true
    } catch(err) {
      log.error(ctx, common.strToTitleCase(err.message))
      return false
    }
  } else {
    log.error(ctx, 'Cannot Get Store Connection')
    return false
  }
}


// -------------------------------------------------
// Store Get File Private URL Function
async function getFilePrivateURL(bucketName, fileName) {
  let ctx = 'store-s3-get-file-url'

  if (connection !== undefined) {
    try {
      switch (config.schema.get('store.driver')) {
        case 'aws', 'minio':
          return connection.presignedGetObject(bucketName, fileName, config.schema.get('store.expired'))
      }
    } catch(err) {
      log.error(ctx, common.strToTitleCase(err.message))
      return false
    }
  } else {
    log.error(ctx, 'Cannot Get Store Connection')
    return false
  }
}


// -------------------------------------------------
// Store Get File Public URL Function
async function getFilePublicURL(bucketName, fileName) {
  let ctx = 'store-s3-get-file-url'
  
  if (connection !== undefined) {
    switch (config.schema.get('store.driver')) {
      case 'aws':
        return 'https://s3-' + config.schema.get('store.region') + '.amazonaws.com/' + 
                bucketName + '/' + fileName.replace(/ /g, '+')
      case 'minio':
        if (!config.schema.get('store.useSSL')) {
          return 'http://' + config.schema.get('store.endPoint') + '/' +
                  bucketName + '/' + fileName
        }
        return 'https://' + config.schema.get('store.endPoint') + '/' +
                bucketName + '/' + fileName
    }
  } else {
    log.error(ctx, 'Cannot Get Store Connection')
    return false
  }
}

 
// -------------------------------------------------
// Export Module
module.exports = {
  getConnection,
  addFileUpload,
  getFilePrivateURL,
  getFilePublicURL
}
