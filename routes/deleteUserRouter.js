var router = require('express').Router();
const auth = require("../middleware/auth");
let  {deleteUser} = require('../controllers/userController');


router.delete('/:id', auth, deleteUser);


module.exports = router;