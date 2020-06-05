'use strict'
const express = require('express');
const router = express.Router();
const map = require('./map');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/map', map);

router.all('*', (req, res, next) => {
  next(createError(404, '페이지 없음'));
})
module.exports = router;
