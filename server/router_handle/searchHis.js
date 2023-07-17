const db = require('../db/index')

exports.getSearchHis = (req, res) => {
    const user = req.query.user

    const sql = "select * from search_history where user = ? ORDER BY id DESC LIMIT 10;"
    db.query(sql, user, (err, results) => {
        if (err) return res.cc(err)
        else res.cc(results, 0)
    })
}

exports.deleteSearchHis = (req, res) => {
    const id = req.query.id
    const sql = "DELETE from search_history WHERE id = ?"
    db.query(sql, id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows === 0) {
            return res.cc("删除失败")
        }
        res.cc("删除成功", 0)
    })
}

exports.deleteSearchHisAll = (req, res) => {
    const user = req.query.user
    const sql = "delete from search_history where user = ?"
    db.query(sql, user, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows === 0) {
            return res.cc("删除失败")
        }
        res.cc("删除成功", 0)
    })
}

exports.addSearchHis = (req, res) => {
    const item = req.body
    const sql = 'insert into search_history set ?'
    db.query(sql, item, (err, results) => {
        if (err) return res.cc(err)
        res.cc("新建成功", 0)
    })
}
