const response = require('./utils-response')


// -------------------------------------------------
// Health Check Function
function healthCheck(res) {
  response.resOK(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  healthCheck
}
