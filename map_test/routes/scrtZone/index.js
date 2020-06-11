'use strict';
const router = require('express').Router();
const ctrl = require('./ctrls');


router.get('/add', ctrl.view);
router.post('/add', ctrl.add);
router.get('/list', ctrl.list);
router.put('/update', ctrl.update);
router.delete('/delete', ctrl.delete);
router.get('/search', ctrl.search);

router.all('*', (req, res) => {
    res.status(404).send({ success: false, msg: `unknown uri ${req.path}` });
});


module.exports = router;