var router = require('express').Router();
const auth = require("../middleware/auth");
let  {adminDashboard} = require('../controllers/userController');

router.get('/', auth, adminDashboard);


module.exports = router;