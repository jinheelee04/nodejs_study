'use strict';
const router = require('express').Router();
const ctrl = require('./ctrls');


router.get('/enroll', ctrl.view);
router.post('/enroll', ctrl.enroll);
router.get('/check', ctrl.check);
router.get('/list', ctrl.list);
router.delete('/delete', ctrl.delete);
router.put('/update', ctrl.update);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});


module.exports = router;