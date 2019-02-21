const multer = require('multer')


// -------------------------------------------------
// Store Local Storage Schema Constant
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  }
})


// -------------------------------------------------
// Store to Local Storage Constant
const storeToLocal = multer({ storage: localStorage })


// -------------------------------------------------
// Store to S3 Storage Constant
const storeToS3 = multer({ storage: multer.memoryStorage() })


// -------------------------------------------------
// Export Module
module.exports = {
  storeToLocal,
  storeToS3
}
