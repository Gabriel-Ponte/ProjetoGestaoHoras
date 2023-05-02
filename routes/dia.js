const express = require("express");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const {
  getAllDiasUtilizador,
  getAllDiasProjeto,
  getDiasProjetoUtilizador,
  getDia,
  createDia,
  updateDia,
  deleteDia,
} = require("../controllers/dias");

router.route("/").post(createDia);
router.route("/diasUtilizador/:utilizador").get(getAllDiasUtilizador);
router.route("/dias/:projeto").get(getAllDiasProjeto);
router.route("/diasUtilizador/:utilizador/:projeto").get(getDiasProjetoUtilizador);
//router.route("/").get(getAllProjetos);

router.route("/:user").get(getDia);
router
  .route("/:id")
  .delete(deleteDia)
  .patch(testUser, updateDia);

module.exports = router;
