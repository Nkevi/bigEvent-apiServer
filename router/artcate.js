const express = require('express');
const router = express.Router();

const artcate_handler = require('../router_handler/artcate');

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入文章分类的验证模块
const { add_cate_schema } = require('../schema/artcate');

router.get('/cates', artcate_handler.getArticleCates);

router.post(
  '/addcates',
  expressJoi(add_cate_schema),
  artcate_handler.addArticleCates
);

const { delete_cate_schema } = require('../schema/artcate');
router.get(
  '/deletecate/:id',
  expressJoi(delete_cate_schema),
  artcate_handler.deleteCateById
);

const { get_cate_schema } = require('../schema/artcate');
const { route } = require('./user');
router.get(
  '/cates/:id',
  expressJoi(get_cate_schema),
  artcate_handler.getArticleById
);

const { update_cate_schema } = require('../schema/artcate');
router.post(
  '/updatecate',
  expressJoi(update_cate_schema),
  artcate_handler.updateCateById
);

module.exports = router;
