const response = require('../utils/response')
const log = require('../utils/logger')


// -------------------------------------------------
// Auth Basic Middleware Function
async function auth(req, res, next) {
  let ctx = 'auth-basic'

  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Basic "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    const logData = {
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      system: req.useragent.platform + '/' + req.useragent.os,
      agent: req.useragent.browser + '/' + req.useragent.version,
      error: 'Unauthorized'
    }
  
    log.warn(ctx, logData)
    response.resAuthenticate(res)
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  // But We Should Decode it First From Base64 Encoding
  let authPayload = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')

  // Split Decoded Authorization Payload Into Username and Password Credentials
  let authCredentials = authPayload.split(':')

  // Check Credentials Section
  // It Should Have 2 Section, Username and Password
  // And It Should Not Empty
  if (authCredentials[0] === '' ||  authCredentials[1] === '') {
    const logData = {
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      system: req.useragent.platform + '/' + req.useragent.os,
      agent: req.useragent.browser + '/' + req.useragent.version,
      error: 'Invalid Authorization'
    }

    log.warn(ctx, logData)
    response.resBadRequest(res, logData.error)
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
  auth
}