var router = require('express').Router();
let  { loginUser } = require('../controllers/userController');

router.post('/', loginUser);



module.exports = router;