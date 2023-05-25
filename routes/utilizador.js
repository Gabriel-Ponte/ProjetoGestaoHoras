const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");
const testUser = require("../middleware/testeUser");


const { register, updateUser, getUser, getAllUser, deleteUser} = require("../controllers/auth");
router.get("/", getAllUser);

router.route("/:id")
    .get(getUser)
    .delete(deleteUser)



router.post("/register", register);
router.patch("/updateUser", authenticateUser, testUser, updateUser);
module.exports = router;
