const response = require('../utils/utils-response')
const log = require('../utils/utils-logger')


// -------------------------------------------------
// Auth Basic Middleware Function
function authBasic(req, res, next) {
  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Basic "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    log.send('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
    response.resAuthenticate(res)
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  // But We Should Decode it First From Base64 Encoding
  let authPayload = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')

  // Split Decoded Authorization Payload Into Username and Password Credentials
  let authCredentials = authPayload.split(':')

  // Check Credentials Section
  // It Should Have 2 Section, Username and Password
  if (authCredentials.length !== 2) {
    log.send('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
    response.resUnauthorized(res)
    return
  }

  // Make Credentials to JSON Format
  req.body = '{"username": "' + authCredentials[0] + '", "password": "' + authCredentials[1] + '"}'

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Export Module
module.exports = {
  authBasic
}