const jwt = require('../../../../pkg/auth/jwt')
const response = require('../../../../pkg/utils/response')


// -------------------------------------------------
// Auth Index Function
function index(req, res) {
  let dataBody = JSON.parse(req.body)

  if (dataBody.username.length === 0 || dataBody.password.length === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  response.resSuccessData(res, {
    token: jwt.getToken({username: dataBody.username}),
    refreshToken: jwt.getRefreshToken({username: dataBody.username})
  })
}


// -------------------------------------------------
// Auth Refresh Function
function refresh(req, res) {
  // Parse JWT Claims from Header
  let dataClaims = jwt.getClaims(res.get('X-JWT-Refresh'))
  
  // Response with JWT Claims
  response.resSuccessData(res, {
    token: jwt.getToken({username: dataClaims.data.username}),
    refreshToken: jwt.getRefreshToken({username: dataClaims.data.username})
  })
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  refresh
}
