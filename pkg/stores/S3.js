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
          endPoint: config.schema.get('store.endpoint'),
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
          log.send('store-s3-add-file-upload').info('Successfully Create Bucket ' + bucketName)
        } else {
          log.send('store-s3-add-file-upload').error('Failed To Get Bucket')
          return false  
        }
      }

      let errPutObject = await new Promise(function(resolve, reject) {
        connection.fPutObject(bucketName, common.strSpaceToUnderscore(fileName), filePath, function(err) {
          if (err) reject(true)
          resolve(false)
        })
      })

      if (errPutObject) {
        log.send('store-s3-add-file-upload').error('Failed To Put Object')
        return false
      } else {
        await new Promise(function(resolve, reject) {
          fs.unlink(filePath, function(err) {
            if (err) reject(err)
            resolve(true)
          })
        })
      }

      log.send('store-s3-add-file-upload').info('Successfully Put Object \'' + fileName + '\'')
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
// Store Get File Private URL Function
async function getFilePrivateURL(bucketName, fileName) {
  if (connection !== undefined) {
    switch (config.schema.get('store.driver')) {
      case 'aws', 'minio':
        return await new Promise(function(resolve, reject) {
          connection.presignedGetObject(bucketName, fileName, config.schema.get('store.expired'), function(err, url) {
            if (err) reject(err)
            resolve(url)
          })
        })
    }
  } else {
    log.send('store-s3-get-file-url').error('Cannot Get Store Connection')
    return false
  }
}


// -------------------------------------------------
// Store Get File Public URL Function
function getFilePublicURL(bucketName, fileName) {
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
    log.send('store-s3-get-file-url').error('Cannot Get Store Connection')
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
