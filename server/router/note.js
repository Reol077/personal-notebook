const express = require('express')
const note_handle = require('../router_handle/note')

const router = express.Router()

router.get('/getTags',note_handle.getTags)
router.get('/getTagsByVal',note_handle.getTagsByVal)
router.post('/addArticle',note_handle.addArticle)
router.get('/getArticle',note_handle.getArticle)
router.put('/updateArticle',note_handle.updateArticle)


module.exports = router