const express = require('express')
const his_handle = require('../router_handle/searchHis')

const router = express.Router()

router.get('/getSearchHis', his_handle.getSearchHis)

router.delete('/deleteSearchHis', his_handle.deleteSearchHis)

router.delete('/deleteSearchHisAll', his_handle.deleteSearchHisAll)

router.post('/addSearchHis', his_handle.addSearchHis)

module.exports = router