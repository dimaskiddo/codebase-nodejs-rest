const express = require('express')
const router = express.Router()

const authBasic = require('../helpers/auth/auth-basic')

const ctlIndex = require('../controllers/index')
const ctlAuth = require('../controllers/auth')


// -------------------------------------------------
// Route List
router.get('/', ctlIndex.index)
router.get('/health', ctlIndex.health)
router.get('/auth', authBasic, ctlAuth.index)


// -------------------------------------------------
// Export Module
module.exports = router
