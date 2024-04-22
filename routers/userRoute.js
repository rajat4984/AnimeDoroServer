const { getUser } = require("../controllers/userController.js");

const router = require("express").Router();

router.get('/getUser',getUser);


module.exports = router;