const express = require('express');
const router = express.Router();

const expressJoi = require('@escook/express-joi');

const userinfo_handler = require('../router_handler/userInfo');
const {
  update_userinfo_schema,
  update_password_schema,
  update_avatar_schema,
} = require('../schema/user');

// 获取用户基本信息的路由
router.get('/userInfo', userinfo_handler.getUserInfo);

// 更新用户基本信息的路由
router.post(
  '/userInfo',
  expressJoi(update_userinfo_schema),
  userinfo_handler.updateUserInfo
);

// 更新用户密码的路由
router.post(
  '/updatepwd',
  expressJoi(update_password_schema),
  userinfo_handler.updatePassword
);

// 更新用户头像的路由
router.post(
  '/update/avatar',
  expressJoi(update_avatar_schema),
  userinfo_handler.updateAvatar
);

module.exports = router;
