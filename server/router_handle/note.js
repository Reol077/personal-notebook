const db = require('../db/index')

exports.getTags = (req, res) => {
    const sql = 'select tag from tags'
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send({ status: 0, tags: results })
        }
    })
}

exports.getTagsByVal = (req, res) => {
    const value = req.query.select
    const sql = "select tag from tags where tag like '%" + value + "%'"
    db.query(sql, (err, results) => {
        if (err) {
            return res.cc(err)
        } else {
            res.send({ status: 0, tags: results })
        }
    })
}

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
    const sql = "select * from articles where user = ?"
    db.query(sql, user, (err, results) => {
        if (err) return res.cc(err)
        res.cc(results)
    })
}

exports.updateArticle = (req, res) => {
    const id  = req.query.id;
    const updatedArticle = req.body;
    const sql = "UPDATE articles SET ? WHERE id = ?";
    db.query(sql, [updatedArticle, id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows === 0) {
            return res.cc("修改失败，文章不存在", 1);
        }
        res.cc("修改成功", 0);
    });
};