const response = require('../helpers/utils/utils-response')
const authJWT = require('../helpers/auth/auth-jwt')


// -------------------------------------------------
// Index Auth Function
function index(req, res) {
  let auth = JSON.parse(req.body)

  if (auth.username.length === 0 || auth.password.legth === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  if (auth.username === 'user' && auth.password == 'password') {
    response.resSuccessData(res, {token: authJWT.getJWT({username: auth.username})})
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  index
}
