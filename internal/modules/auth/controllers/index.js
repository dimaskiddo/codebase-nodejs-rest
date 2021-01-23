const jwt = require('../../../../pkg/auth/jwt')
const response = require('../../../../pkg/utils/response')


// -------------------------------------------------
// Auth Index Function
async function index(req, res) {
  let dataBody = JSON.parse(req.body)

  if (dataBody.username.length === 0 || dataBody.password.length === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  response.resSuccessData(res, {
    token: await jwt.getToken({username: dataBody.username}),
    refreshToken: await jwt.getRefreshToken({username: dataBody.username})
  })
}


// -------------------------------------------------
// Auth Refresh Function
async function refresh(req, res) {
  // Parse JWT Claims from Header
  let dataClaims = await jwt.getClaims(res.get('X-JWT-Refresh'))
  
  // Response with JWT Claims
  response.resSuccessData(res, {
    token: await jwt.getToken({username: dataClaims.data.username}),
    refreshToken: await jwt.getRefreshToken({username: dataClaims.data.username})
  })
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  refresh
}
