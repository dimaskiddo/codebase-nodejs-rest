const response = require('../helpers/utils/utils-response')


// -------------------------------------------------
// Index User Function
function index(req, res) {
  // Decode JWT Data from Header
  let jwtData = JSON.parse(Buffer.from(res.get('X-JWT-Data'), 'base64'))
  
  // Response with JWT Data
  response.resSuccessData(res, jwtData.data)
}


// -------------------------------------------------
// Export Module
module.exports = {
  index
}
