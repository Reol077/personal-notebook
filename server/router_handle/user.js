const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.regUser = (req, res) => {
    const userinfo = req.body

    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc("用户名被占用，请更换其他用户名")
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        const sql = 'insert into users set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("注册用户失败，请稍后再试")
            res.cc("注册成功", 0)
        })
    })
}

exports.login = (req, res) => {
    const userinfo = req.body

    const sql = 'select * from users where username=?'

    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户名未注册")
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) res.cc('登录失败，密码错误')
        else {
            const user = { ...results[0], password: "" }
            const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
            res.send({ status: 0, message: "登录成功", token: 'Bearer ' + tokenStr })
        }
    })

}

exports.getUser = (req, res) => {
    const user = req.query.user
    const sql = 'select * from users where username=?'

    db.query(sql, user, (err, results) => {
        if (err) return res.cc(err)
        res.cc(results, 0)
    })
}

exports.updateUsername = (req, res) => {
    const username = req.body
    const sql = "UPDATE users set ? where id =?"
    db.query(sql, [username, req.user.id], (err, results) => {
        if (err) {
            if (err.sqlState === '23000') return res.cc("用户名重复！")
            else return res.cc(err)
        }
        if (results.affectedRows === 0) {
            return res.cc(results.message)
        }
        res.cc("修改成功", 0)
    })
}

exports.updateNickname = (req, res) => {
    const id = req.query.id
    const nickname = req.body
    const sql = "UPDATE users set ? where id =?"
    db.query(sql, [nickname, id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows === 0) {
            return res.cc(results.message)
        }
        res.cc("修改成功", 0)
    })
}

exports.updatePassword = (req, res) => {
    const sql = 'select * from users where id = ?'
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc("用户不存在！")
        const compareResult = bcrypt.compareSync(req.body.oldPassword, results[0].password)
        if (!compareResult) return res.cc("原密码错误")

        const sql = 'update users set password = ? where id = ?'

        const newPassword = bcrypt.hashSync(req.body.newPassword, 10)

        db.query(sql, [newPassword, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc("更新密码失败")

            res.cc("更新密码成功", 0)
        })
    })
}

exports.removeUser = (req, res) => {
    const sql = "DELETE from users where id = ?"
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc("注销失败")
        res.cc("注销成功", 0)
    })
}