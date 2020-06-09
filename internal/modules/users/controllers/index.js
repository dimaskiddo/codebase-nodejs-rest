const async = require('async')

const jwt = require('../../../../pkg/auth/jwt')
const store = require('../../../../pkg/stores/S3')

const common = require('../../../../pkg/utils/common')
const response = require('../../../../pkg/utils/response')


// -------------------------------------------------
// User Index Function
function index(req, res) {
  // Parse JWT Claims from Header
  let dataClaims = jwt.getClaims(res.get('X-JWT-Claims'))
  
  // Response with JWT Claims
  response.resSuccessData(res, dataClaims.data)
}


// -------------------------------------------------
// User Upload File Function
async function uploadFile(req, res) {
  // Upload File
  let isUploaded = await store.addFileUpload(req.params.bucketName, req.file.originalname, req.file.path)

  if (isUploaded) {
    response.resSuccess(res)
  } else {
    response.resInternalError(res)
  }
}


// -------------------------------------------------
// User Upload Multi File Function
async function uploadMultiFile(req, res) {
  // Upload Multi File
  try {
    async.each(req.files, function(file) {
      store.addFileUpload(req.params.bucketName, file.originalname, file.path)
    })  

    response.resSuccess(res)
  } catch(err) {
    response.resInternalError(res, common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// User Get Uploaded File Function
async function getUploadedFile(req, res) {
  // Requested File Name
  let reqFileName = req.body.file

  // Get Uploaded File
  let filePrivateURL = await store.getFilePrivateURL(req.params.bucketName, reqFileName)

  response.resSuccessData(res, {fileURL: filePrivateURL})
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  uploadFile,
  uploadMultiFile,
  getUploadedFile
}
