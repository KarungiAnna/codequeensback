var router = require('express').Router();
let  {createUser} = require('../controllers/userController');

router.post('/', createUser);



module.exports = router;


