// import express module
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors);

app.use(express.urlencoded({ extended: false }));

// 在所有的路由之前，挂载一个全局的处理错误信息的中间件
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status: status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

const config = require('./config');
const expressJwt = require('express-jwt');
app.use(
  expressJwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
    path: [/^\/api\//],
  })
);

const userRouter = require('./router/user');
app.use('/api', userRouter);

const userInfoRouter = require('./router/userInfo');
app.use('/my', userInfoRouter);

const artCateRouter = require('./router/artcate');
app.use('/my/artcate', artCateRouter);

const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);

app.use('/uploads', express.static('./uploads'));

const joi = require('@hapi/joi');
app.use((err, req, res, next) => {
  // 数据认证错误
  if (err instanceof joi.ValidationError) return res.cc(err);

  // 身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');

  // 未知错误
  res.cc(err);
});

app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
});
