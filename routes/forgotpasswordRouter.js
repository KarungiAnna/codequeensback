var router = require('express').Router();
let  { forgotPassword } = require('../controllers/userController');

router.post('/', forgotPassword);



module.exports = router;