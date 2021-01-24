const fs = require('fs')
const crypto = require('crypto')

const config = require('../config')

const keyPrivate = fs.readFileSync(config.schema.get('server.keys.private'), 'utf8')
const keyPublic = fs.readFileSync(config.schema.get('server.keys.public'), 'utf8')


// -------------------------------------------------
// Encrypt Using RSA Function
function encryptWithRSA(data) {
  let encrypted = crypto.publicEncrypt(keyPublic, Buffer.from(data))
  return encrypted.toString('base64')
}


// -------------------------------------------------
// Decrypt Using RSA Function
function decryptWithRSA(data) {
  let decrypted = crypto.privateDecrypt(keyPrivate, Buffer.from(data, 'base64'))
  return decrypted.toString('utf8')
}


// -------------------------------------------------
// Export Module
module.exports = {
  keyPrivate,
  keyPublic,
  encryptWithRSA,
  decryptWithRSA
}
