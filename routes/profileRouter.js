var router = require('express').Router();
const auth = require("../middleware/auth");
let  {userProfile} = require('../controllers/userController');

router.get('/', auth, userProfile);


module.exports = router;
