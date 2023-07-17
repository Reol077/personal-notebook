const db = require('../db/index')

exports.addArticle = (req, res) => {
    const article = req.body
    const sql = 'insert into articles set ?'
    db.query(sql, article, (err, results) => {
        if (err) return res.cc(err)
        res.cc("发布成功", 0)
    })
}

exports.getArticle = (req, res) => {
    const user = req.query.user
    const sql = "select a.*,u.nickname from articles a inner join users u on a.user = u.username where u.username = ?"
    db.query(sql, user, (err, results) => {
        if (err) return res.cc(err)
        res.cc(results, 0)
    })
}

exports.getArticleByTag = (req, res) => {
    const user = req.query.user
    const tag = req.query.tag
    const sql = "select a.*,u.nickname from articles a inner join users u on a.user = u.username where u.username = ? and a.tags like '%" + tag + "%'"
    db.query(sql, [user], (err, results) => {
        if (err) return res.cc(err)
        res.cc(results, 0)
    })
}

exports.updateArticle = (req, res) => {
    const id = req.query.id
    const updatedArticle = req.body
    const sql = "UPDATE articles SET ? WHERE id = ?"
    db.query(sql, [updatedArticle, id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows === 0) {
            return res.cc("修改失败，文章不存在", 1)
        }
        res.cc("修改成功", 0)
    })
}

exports.deleteArticle = (req, res) => {
    const id = req.query.id
    const sql = "DELETE from articles WHERE id = ?"
    db.query(sql, id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows === 0) {
            return res.cc("删除失败，文章不存在")
        }
        res.cc("删除成功", 0)
    })
}