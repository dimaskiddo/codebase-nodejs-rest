const auth = require('../helpers/auth/auth-jwt')

const response = require('../helpers/utils/utils-response')


// -------------------------------------------------
// Index Auth Function
function index(req, res) {
  let data = JSON.parse(req.body)

  if (data.username.length === 0 || data.password.legth === 0) {
    response.resBadRequest(res, 'Invalid Authorizaton')
    return
  }

  if (data.username === 'user' && data.password == 'password') {
    response.resSuccessData(res, {token: auth.getJWT({username: auth.username})})
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  index
}
