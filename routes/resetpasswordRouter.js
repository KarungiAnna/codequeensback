var router = require('express').Router();
let  { resetPassword } = require('../controllers/userController');

router.post('/:token', resetPassword);



module.exports = router;