const mysql = require('mysql')

const HOST = '127.0.0.1'
const User = 'root'
const Password = '1109reol'
const Database = 'personal_notebook'

const db = mysql.createPool({
    host: HOST,
    user: User,
    password: Password,
    database: Database,
})

module.exports = db