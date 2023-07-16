const express = require('express')
const note_handle = require('../router_handle/note')

const router = express.Router()


router.post('/addArticle',note_handle.addArticle)

router.get('/getArticle',note_handle.getArticle)

router.get('/getArticleByTag',note_handle.getArticleByTag)

router.put('/updateArticle',note_handle.updateArticle)

router.delete('/deleteArticle',note_handle.deleteArticle)


module.exports = router