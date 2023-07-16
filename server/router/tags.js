const express = require('express')
const tags_handle = require('../router_handle/tags')

const router = express.Router()

router.get('/getTags', tags_handle.getTags)

router.get('/getTagsByVal', tags_handle.getTagsByVal)

router.post('/addTags', tags_handle.addTags)

module.exports = router