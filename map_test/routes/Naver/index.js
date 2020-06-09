'use strict';
const router = require('express').Router();
const ctrl = require('./ctrls');


router.get('/basic', ctrl.basic);
router.get('/overlay', ctrl.overlay);
router.get('/index', ctrl.index);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});


module.exports = router;