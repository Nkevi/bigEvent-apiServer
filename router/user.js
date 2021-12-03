const express = require('express');
const router = express.Router();

const userHandler = require('../router_handler/user');

// @escook/express-joi 自动对表单数据进行验证
const expressJoi = require('@escook/express-joi');
const { reg_login_schema } = require('../schema/user');

router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser);

router.post('/login', expressJoi(reg_login_schema), userHandler.login);

module.exports = router;
