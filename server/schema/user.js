const joi = require('@hapi/joi')

const username = joi.string().alphanum().min(3).max(12).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

const id = joi.number().integer().min(1).required
const nickname = joi.string().required()

exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

exports.updata_username_schema = {
    body: {
        username
    }
}

exports.updata_password_schema = {
    body: {
        oldPassword: password,
        newPassword: joi.not(joi.ref('oldPassword')).concat(password)
    }
}
