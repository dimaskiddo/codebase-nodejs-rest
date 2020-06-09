const multer = require('multer')
const config = require('../config')


// -------------------------------------------------
// Store Local Storage Schema Constant
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.schema.get('server.upload.path'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname)
  }
})


// -------------------------------------------------
// Store to Local Storage Constant
const storeToLocal = multer({ storage: localStorage })


// -------------------------------------------------
// Export Module
module.exports = {
  storeToLocal
}
