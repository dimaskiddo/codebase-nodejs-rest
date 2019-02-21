const jwt = require('jsonwebtoken')
const config = require('../../config')

const crypt = require('../utils/utils-crypt')
const response = require('../utils/utils-response')
const log = require('../utils/utils-logger')

const jwtOptions = {
  expiresIn: config.schema.get('jwt.expired'),
  algorithm: 'RS256'  
}


// -------------------------------------------------
// Auth JWT Middleware Function
function auth(req, res, next) {
  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Bearer "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    log.send('http-access').warn('Unauthorized Method ' + req.method + ' at URI ' + req.url)
    response.resUnauthorized(res)
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  let authPayload = req.headers.authorization.split(' ')[1]

  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authClaims = JSON.stringify(jwt.verify(authPayload, crypt.keyPublic, jwtOptions))

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Claims', crypt.encryptWithRSA(authClaims))

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Get JWT Token Function
function getToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Get JWT Claims Function
function getClaims(data) {
  return JSON.parse(crypt.decryptWithRSA(data))
}


// -------------------------------------------------
// Export Module
module.exports = {
  auth,
  getToken,
  getClaims
}
