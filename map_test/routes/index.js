'use strict'
const express = require('express');
const router = express.Router();
const naver = require('./Naver');
const kakao = require('./Kakao');
const vstrStatus = require('./vstrStatus');
const vstrLocation = require('./vstrLocation');
const user = require('./user');
const scrtZone = require('./scrtZone');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/map/naver', naver);
router.use('/map/kakao', kakao);

router.use('/vstrStatus', vstrStatus);
router.use('/vstrLocation', vstrLocation);

router.use('/user', user);

router.use('/scrtZone', scrtZone);

router.all('*', (req, res, next) => {
  next(createError(404, '페이지 없음'));
})
module.exports = router;
