const express = require("express");
const router = express.Router();

const {login, register, postResetPassword, updateResetedPassword} = require("../controllers/auth");
router.post("/resetPassword/:email", postResetPassword);
router.post("/updateResetedPassword/", updateResetedPassword);
router.post("/login", login);
router.post("/register", register);
module.exports = router;
