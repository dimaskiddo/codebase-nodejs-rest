const authJWT = require('../helpers/auth/auth-jwt')

const response = require('../helpers/utils/utils-response')


// -------------------------------------------------
// Index Auth Function
function index(req, res) {
  let data = JSON.parse(req.body)

  if (data.username.length === 0 || data.password.legth === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  response.resSuccessData(res, {token: authJWT.getJWT({username: data.username})})
}


// -------------------------------------------------
// Export Module
module.exports = {
  index
}
