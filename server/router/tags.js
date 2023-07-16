const express = require('express')
const note_handle = require('../router_handle/tags')

const router = express.Router()

router.get('/getTags', note_handle.getTags)
router.get('/getTagsByVal', note_handle.getTagsByVal)
router.post('/addTags', note_handle.addTags)

module.exports = router