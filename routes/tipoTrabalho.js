const express = require("express");

const authenticateUser = require("../middleware/authentication");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const { getAllTiposTrabalho, createTipoTrabalho, deleteTipoTrabalho, updateTipoTrabalho} = require("../controllers/tipoTrabalho");

router.route("/").post(createTipoTrabalho).get(getAllTiposTrabalho);

router
  .route("/:id")
  .delete(deleteTipoTrabalho)
  .patch(testUser, updateTipoTrabalho);

module.exports = router;
