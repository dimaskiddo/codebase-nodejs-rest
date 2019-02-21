const express = require('express')

const authBasic = require('../helpers/auth/auth-basic')
const authJWT = require('../helpers/auth/auth-jwt')

const ctlIndex = require('../controllers/index')
const ctlAuth = require('../controllers/auth')
const ctlUsers = require('../controllers/users')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', ctlIndex.index)
router.get('/health', ctlIndex.health)
router.get('/auth', authBasic.authBasic, ctlAuth.index)
router.get('/users', authJWT.authJWT, ctlUsers.index)


// -------------------------------------------------
// Export Module
module.exports = router
