const jwt = require('../../../../pkg/auth/jwt')
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
// Export Module
module.exports = {
  index
}
