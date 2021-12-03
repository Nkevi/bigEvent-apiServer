const db = require('../db/index');

// 对用户密码进行加密的模块
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const config = require('../config');

exports.regUser = (req, res) => {
  const userInfo = req.body;

  // 判断用户名或密码是否为空
  if (!userInfo.username || !userInfo.password) {
    return res.cc('用户名或密码不能为空！');
  }

  // 判断注册的用户名是否可用
  const sql = `select * from my_db_01.ev_users where username=?`;
  db.query(sql, userInfo.username, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    if (results.length > 0) {
      return res.cc('此用户名已被占用，请更换其他用户名！');
    }
  });

  // 对密码进行加密
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);

  // 在数据库中加入新用户
  sql = 'insert into my_db_01.ev_users set ?';
  db.query(sql, userInfo, (err, results) => {
    if (err) {
      return res.cc(err);
    }
    // 注册失败
    if (results.affectRows !== 1) {
      return res.cc('注册用户失败，请稍后再试！');
    }
    // 注册成功
    res.cc('注册成功！', 0);
  });
};

exports.login = (req, res) => {
  const userInfo = req.body;
  const sql = `select * from my_db_01.ev_users where username=?`;

  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('登录失败！');

    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc('密码错误，登录失败！');

    const user = { ...results[0], password: '', user_pic: '' };
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: '10h' });

    res.send({
      status: 0,
      message: '登录成功',
      // 为了方便客户端使用token，直接在服务端拼接上Bearer前缀
      token: 'Bearer ' + tokenStr,
    });
  });
};
