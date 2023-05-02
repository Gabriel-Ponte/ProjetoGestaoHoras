const express = require("express");

const authenticateUser = require("../middleware/authentication");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const { getAllTiposTrabalho, createTipoTrabalho } = require("../controllers/tipoTrabalho");

router.route("/").post(createTipoTrabalho).get(getAllTiposTrabalho);

module.exports = router;
