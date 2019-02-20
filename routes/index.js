const express = require('express')

const auth = require('../helpers/auth/auth-basic')

const ctlIndex = require('../controllers/index')
const ctlAuth = require('../controllers/auth')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', ctlIndex.index)
router.get('/health', ctlIndex.health)
router.get('/auth', auth.authBasic, ctlAuth.index)


// -------------------------------------------------
// Export Module
module.exports = router
