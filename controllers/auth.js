const jwt = require('../helpers/auth/auth-jwt')
const response = require('../helpers/utils/utils-response')


// -------------------------------------------------
// Index Auth Function
function index(req, res) {
  let dataBody = JSON.parse(req.body)

  if (dataBody.username.length === 0 || dataBody.password.length === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  response.resSuccessData(res, {token: jwt.getToken({username: dataBody.username})})
}


// -------------------------------------------------
// Export Module
module.exports = {
  index
}
