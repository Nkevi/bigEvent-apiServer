const db = require('../db/index');

// 获取文章分类的函数
exports.getArticleCates = (req, res) => {
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // is_delete 为 0 表示没有被标记为删除的数据
  const sql =
    'select * from my_db_01.ev_article_cate where is_delete=0 order by id asc';
  db.query(sql, (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err);
    // 2. 执行 SQL 语句成功
    res.send({
      status: 0,
      message: '获取文章分类列表成功！',
      data: results,
    });
  });
};

// 添加文章分类的函数
exports.addArticleCates = (req, res) => {
  // 定义查询分类名称与分类别名是否被占用的SQL语句
  const sql = `select * from my_db_01.ev_article_cate where name=? or alias=?`;
  // 执行查重操作
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);
    if (results.length === 2)
      return res.cc('分类名称与别名被占用，请更换后重试！');
    // 分别判断分类名称和分类别名是否被占用
    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc('分类名称被占用，请更换后重试！');
    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc('分类别名被占用，请更换后重试！');

    sql = `insert into my_db_01.ev_article_cate set ?`;
    db.query(sql, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('新增文章分类失败！');
      res.cc('新增文章分类成功！', 0);
    });
  });
};

// 删除文章分类的函数
exports.deleteCateById = (req, res) => {
  const sql = `update my_db_01.ev_article_cate set is_delete=1 where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！');
    res.cc('删除文章分类成功！', 0);
  });
};

exports.getArticleById = (req, res) => {
  const sql = `select * from my_db_01.ev_article_cate where id=?`;
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('获取文章分类数局失败！');
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results[0],
    });
  });
};

exports.updateCateById = (req, res) => {
  const sql = `select * from my_db_01.ev_article_cate where id=? and (name=? or alias=?)`;
  db.query(sql, [req.body.id, req.body.name, req.body.alias], (req, res) => {
    if (err) return res.cc(err);
    if (results.length === 2)
      return res.cc('分类名称与别名被占用，请更换后重试！');
    if (results.length === 1) {
      if (results[0].name === req.body.name)
        return res.cc('分类名称被占用，请更换后重试！');
      if (results[0].alias === req.body.alias)
        return res.cc('分类别名被占用，请更换后重试！');
    }
    const sql = `update my_db_01.ev_article_cate set ? where Id=?`;
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！');
      res.cc('更新文章分类成功！', 0);
    });
  });
};
