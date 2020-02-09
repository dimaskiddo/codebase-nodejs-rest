const express = require('express')

const basic = require('../../pkg/auth/basic')
const jwt = require('../../pkg/auth/jwt')

const modIndex = require('../modules/index/controllers/index')
const modAuth = require('../modules/auth/controllers/index')
const modUsers = require('../modules/users/controllers/index')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', modIndex.index)
router.get('/health', modIndex.health)
router.get('/auth', basic.auth, modAuth.index)
router.get('/users', jwt.auth, modUsers.index)


// -------------------------------------------------
// Export Module
module.exports = router
