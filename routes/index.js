const express = require('express')

const basic = require('../helpers/auth/auth-basic')
const jwt = require('../helpers/auth/auth-jwt')

const ctlIndex = require('../controllers/index')
const ctlAuth = require('../controllers/auth')
const ctlUsers = require('../controllers/users')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', ctlIndex.index)
router.get('/health', ctlIndex.health)
router.get('/auth', basic.auth, ctlAuth.index)
router.get('/users', jwt.auth, ctlUsers.index)


// -------------------------------------------------
// Export Module
module.exports = router
