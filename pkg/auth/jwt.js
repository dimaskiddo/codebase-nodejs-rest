const jwt = require('jsonwebtoken')
const config = require('../config')

const crypt = require('../utils/crypt')
const response = require('../utils/response')
const log = require('../utils/logger')

const jwtOptions = {
  issuer: config.schema.get('jwt.issuer'),
  audience: config.schema.get('jwt.audience'),
  expiresIn: config.schema.get('jwt.expired'),
  algorithm: 'RS256'  
}

const jwtRefreshOptions = {
  issuer: config.schema.get('jwt.issuer'),
  audience: config.schema.get('jwt.audience'),
  expiresIn: config.schema.get('jwt.refresh'),
  algorithm: 'RS256'  
}


// -------------------------------------------------
// Auth JWT Middleware Function
function auth(req, res) {
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
  return JSON.stringify(jwt.verify(authPayload, crypt.keyPublic, jwtOptions))
}


// -------------------------------------------------
// Auth JWT Claims Middleware Function
function authClaims(req, res, next) {
  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authClaims = auth(req, res)

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Claims', crypt.encryptWithRSA(authClaims))

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Auth JWT Refresh Middleware Function
function authRefresh(req, res, next) {
  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authRefresh = auth(req, res)

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Refresh', crypt.encryptWithRSA(authRefresh))
  
  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Get JWT Token Function
function getToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Get JWT Refresh Token Function
function getRefreshToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtRefreshOptions)
}


// -------------------------------------------------
// Get JWT Claims Function
function getClaims(data) {
  return JSON.parse(crypt.decryptWithRSA(data))
}


// -------------------------------------------------
// Export Module
module.exports = {
  authClaims,
  authRefresh,
  getToken,
  getRefreshToken,
  getClaims
}
