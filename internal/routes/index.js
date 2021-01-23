const express = require('express')

const config = require('../../pkg/config')

const basic = require('../../pkg/auth/basic')
const jwt = require('../../pkg/auth/jwt')

const store = require('../../pkg/utils/store')

const ctlIndex = require('../modules/index/controllers/index')
const ctlAuth = require('../modules/auth/controllers/index')
const ctlUsers = require('../modules/users/controllers/index')
const ctlStores = require('../modules/stores/controllers/index')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', ctlIndex.index)
router.get('/health', ctlIndex.health)

router.get('/auth', basic.auth, ctlAuth.index)
router.get('/auth/refresh', jwt.refresh, ctlAuth.refresh)

router.get('/users', jwt.auth, ctlUsers.index)

router.post('/stores/:bucketName', jwt.auth, store.storeToLocal.single('file'), ctlStores.storeFile)
router.post('/stores/:bucketName/bulk', jwt.auth, store.storeToLocal.array('file', config.schema.get('server.upload.max')), ctlStores.storeFileBulk)
router.get('/stores/:bucketName/link', jwt.auth, ctlStores.storeLink)


// -------------------------------------------------
// Export Module
module.exports = router
