const async = require('async')

const store = require('../../../../pkg/stores/S3')

const common = require('../../../../pkg/utils/common')
const response = require('../../../../pkg/utils/response')
const log = require('../../../../pkg/utils/logger')


// -------------------------------------------------
// Store File Function
async function storeFile(req, res) {
  let ctx = 'controller-store-file'

  try {
    // Store File
    let isUploaded = await store.addFileUpload(req.params.bucketName, req.file.originalname, req.file.path)

    if (isUploaded) {
      response.resSuccess(res)
    } else {
      response.resInternalError(res)
    }
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    response.resInternalError(res, common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// Store Multi File Function
async function storeFileBulk(req, res) {
  let ctx = 'controller-store-file-bulk'

  try {
    // Store Multi File
    await Promise.all(req.files.map(async (file) => {
      await store.addFileUpload(req.params.bucketName, file.originalname, file.path)
    }))
  
    response.resSuccess(res)
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    response.resInternalError(res, common.strToTitleCase(err.message))
  }  
}


// -------------------------------------------------
// User Store Link Function
async function storeLink(req, res) {
  let ctx = 'controller-store-link'

  try {
    // Get Store Link
    let filePrivateURL = await store.getFilePrivateURL(req.params.bucketName, req.body.fileName)

    response.resSuccessData(res, { fileURL: filePrivateURL })
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    response.resInternalError(res, common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  storeFile,
  storeFileBulk,
  storeLink
}
