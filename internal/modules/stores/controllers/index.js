const async = require('async')

const store = require('../../../../pkg/stores/S3')

const common = require('../../../../pkg/utils/common')
const response = require('../../../../pkg/utils/response')


// -------------------------------------------------
// Store File Function
async function storeFile(req, res) {
  // Store File
  let isUploaded = await store.addFileUpload(req.params.bucketName, req.file.originalname, req.file.path)

  if (isUploaded) {
    response.resSuccess(res)
  } else {
    response.resInternalError(res)
  }
}


// -------------------------------------------------
// Store Multi File Function
async function storeMultiFile(req, res) {
  // Store Multi File
  async.each(req.files, function(file) {
    store.addFileUpload(req.params.bucketName, file.originalname, file.path)
  }, function(err){
    response.resInternalError(res, common.strToTitleCase(err.message))
  })

  response.resSuccess(res)
}


// -------------------------------------------------
// User Store Link Function
async function storeLink(req, res) {
  // Get Store Link
  let filePrivateURL = await store.getFilePrivateURL(req.params.bucketName, req.body.fileName)

  response.resSuccessData(res, {fileURL: filePrivateURL})
}


// -------------------------------------------------
// Export Module
module.exports = {
  storeFile,
  storeMultiFile,
  storeLink
}
