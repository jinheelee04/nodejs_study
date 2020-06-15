'use strict';
const router = require('express').Router();
const ctrl = require('./ctrls');


router.get('/google', ctrl.google);
router.put('/collect', ctrl.collect);
router.get('/test', ctrl.test);


router.get('/naver', ctrl.naver);
router.get('/kt', ctrl.kt);
router.get('/kakao', ctrl.kakao);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});


module.exports = router;