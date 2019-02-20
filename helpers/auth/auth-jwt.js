const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const response = require('../utils/utils-response')

const keyPrivate = fs.readFileSync('./private.key', 'utf-8')
const keyPublic = fs.readFileSync('./public.key', 'utf-8')

const jwtOptions = {
  expiresIn: config.schema.get('jwt.expired')
}


// -------------------------------------------------
// Auth JWT Middleware Function
function authJWT(req, res, next) {
  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Bearer "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    response.resUnauthorized(res)
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  let authPayload = req.headers.authorization.split(' ')[1]

  // Get Authorization Claims From JWT Token
  let authClaims = jwt.verify(authPayload, keyPublic, jwtOptions)

  // Set Extracted Authorization Claims to HTTP Header
  req.Set('X-JWT-Data', authClaims)

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Get JWT Token Function
function getJWT(authPayload) {
  return jwt.sign({data: authPayload}, keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Export Module
module.exports = {
  authJWT,
  getJWT
}
