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
// Auth JWT Claim Function
function claim(req) {
  // The Second Authorization Section Should Be The Credentials Payload
  let authPayload = req.headers.authorization.split(' ')[1]

  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  return JSON.stringify(jwt.verify(authPayload, crypt.keyPublic, jwtOptions))
}


// -------------------------------------------------
// Auth JWT Auth Middleware Function
async function auth(req, res, next) {
  let ctx = 'auth-jwt'

  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Bearer "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    const logData = {
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      system: req.useragent.platform + '/' + req.useragent.os,
      agent: req.useragent.browser + '/' + req.useragent.version,
      error: 'Unauthorized'
    }

    log.warn(ctx, logData)
    response.resUnauthorized(res, logData.error)
    return
  }

  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authClaims = claim(req)

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Claims', crypt.encryptWithRSA(authClaims))

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Auth JWT Refresh Middleware Function
async function refresh(req, res, next) {
  let ctx = 'auth-jwt-refresh'

  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Bearer "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    const logData = {
      ip: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket.remoteAddress,
      method: req.method,
      url: req.url,
      system: req.useragent.platform + '/' + req.useragent.os,
      agent: req.useragent.browser + '/' + req.useragent.version,
      error: 'Unauthorized'
    }

    log.warn(ctx, logData)
    response.resUnauthorized(res, logData.error)
    return
  }

  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authRefreshClaims = claim(req)

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Refresh', crypt.encryptWithRSA(authRefreshClaims))
  
  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Get JWT Token Function
async function getToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Get JWT Refresh Token Function
async function getRefreshToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtRefreshOptions)
}


// -------------------------------------------------
// Get JWT Claims Function
async function getClaims(data) {
  return JSON.parse(crypt.decryptWithRSA(data))
}


// -------------------------------------------------
// Export Module
module.exports = {
  auth,
  refresh,
  getToken,
  getRefreshToken,
  getClaims
}
