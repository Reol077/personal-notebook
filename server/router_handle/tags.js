const db = require('../db/index')

exports.getTags = (req, res) => {
    const user = req.query.user
    const sql = 'select id, tag, color from tags where user=?'
    db.query(sql, user, (err, results) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send({ status: 0, tags: results })
        }
    })
}

exports.getTagsByVal = (req, res) => {
    const select = req.query.select
    const user = req.query.user
    const sql = "select tag from tags where tag like '%" + select + "%' and user = ?"
    db.query(sql, user, (err, results) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send({ status: 0, tags: results })
        }
    })
}

exports.addTags = (req, res) => {
    const tag = req.body
    const sql = 'insert into tags set ?'
    db.query(sql, tag, (err, results) => {
        if (err) return res.cc(err)
        res.cc("新建成功", 0)
    })
}