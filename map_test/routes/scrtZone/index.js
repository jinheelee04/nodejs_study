'use strict';
const router = require('express').Router();
const ctrl = require('./ctrls');


router.get('/add', ctrl.view);
router.post('/add', ctrl.add);
router.get('/list', ctrl.list);
router.post('/list/:keyword', ctrl.search);
router.put('/update', ctrl.update);
router.get('/update/:zoneId', ctrl.getOne);
router.delete('/delete', ctrl.delete);


router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});


module.exports = router;