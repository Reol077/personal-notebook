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

exports.deleteTag = (req, res) => {
    const id = req.query.id
    const user = req.query.user
    const tag = req.query.tag

    const selectSql = "select * from articles where user = ? and tags like '%" + tag + "%'"
    db.query(selectSql, user, (err, results) => {
        if (err) return res.cc(err)
        if (results.length > 0) return res.cc("删除失败，有文章正在使用该标签")
        else {
            const sql = "DELETE from tags where id = ?"
            db.query(sql, id, (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows === 0) {
                    return res.cc("删除失败，标签不存在")
                }
                res.cc("删除成功", 0)
            })
        }
    })

}