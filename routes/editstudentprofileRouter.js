var router = require('express').Router();
const auth = require("../middleware/auth");
let  {editstudentProfile} = require('../controllers/userController');

router.post('/:id', auth ,editstudentProfile );



module.exports = router;

