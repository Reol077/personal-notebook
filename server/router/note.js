const express = require('express')
const note_handle = require('../router_handle/note')

const router = express.Router()

router.get('/getTags',note_handle.getTags)
router.get('/getNoteByVal',note_handle.getTagsByVal)
router.post('/addArticle',note_handle.addArticle)
router.get('/getArticle',note_handle.getArticle)


module.exports = router