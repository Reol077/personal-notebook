const express = require('express')
const user_handle = require('../router_handle/user')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema, updata_username_schema, updata_password_schema } = require('../schema/user')

const router = express.Router()

router.post('/regUser', expressJoi(reg_login_schema), user_handle.regUser)

router.post('/login', expressJoi(reg_login_schema), user_handle.login)

router.get('/getUser', user_handle.getUser)

router.put('/updateUsername', expressJoi(updata_username_schema), user_handle.updateUsername)

router.put('/updateNickname', user_handle.updateNickname)

router.put('/updatePassword', expressJoi(updata_password_schema), user_handle.updatePassword)

router.delete('/removeUser', user_handle.removeUser)


module.exports = router