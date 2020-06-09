const express = require('express')

const config = require('../../pkg/config')

const basic = require('../../pkg/auth/basic')
const jwt = require('../../pkg/auth/jwt')

const store = require('../../pkg/utils/store')

const modIndex = require('../modules/index/controllers/index')
const modAuth = require('../modules/auth/controllers/index')
const modUsers = require('../modules/users/controllers/index')

const router = express.Router()


// -------------------------------------------------
// Route List
router.get('/', modIndex.index)
router.get('/health', modIndex.health)

router.get('/auth', basic.auth, modAuth.index)
router.get('/auth/refresh', jwt.authRefresh, modAuth.refresh)

router.get('/users', jwt.authClaims, modUsers.index)

router.post('/users/upload/:bucketName', jwt.authClaims, store.storeToLocal.single('file'), modUsers.uploadFile)
router.post('/users/upload/:bucketName/multi', jwt.authClaims, store.storeToLocal.array('file', config.schema.get('server.upload.max')), modUsers.uploadMultiFile)
router.get('/users/upload/:bucketName/link', jwt.authClaims, modUsers.getUploadedFile)


// -------------------------------------------------
// Export Module
module.exports = router
