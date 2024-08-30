const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authentication");


const { register, updateUser, getUser, getAllUser, deleteUser, updateUserType, getAllUserTipo} = require("../controllers/auth");
router.get("/", getAllUser);

router.route("/:id")
    .get(getUser)
    .delete(deleteUser)


router.route("/getAllUserTipo/:tipo").get(getAllUserTipo);
router.post("/register", register);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updateUserType", authenticateUser, updateUserType);
module.exports = router;
