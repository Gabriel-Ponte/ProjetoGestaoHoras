const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const testUser = require("../middleware/testeUser");


const { register, updateUser, getUser, getAllUser} = require("../controllers/auth");
router.get("/", getAllUser);
router.get("/:id", getUser);
router.post("/register", register);
router.patch("/updateUser", authenticateUser, testUser, updateUser);
module.exports = router;
