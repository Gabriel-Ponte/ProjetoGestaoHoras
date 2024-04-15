const express = require("express");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const {
  getAllDiasUtilizador,
  getAllDiasProjeto,
  getAllDiasHorasExtra,
  getDiasProjetoUtilizador,
  getDia,
  createDia,
  updateDia,
  deleteDia,
  exportDias,
  getAllDias,
  getAllDiasUtilizadorTipo,
  declineDiasHorasExtra,
  acceptDiasHorasExtra,
  getAllDiasHorasExtraAccepted,
  getAllDiasHorasExtraDeclined,
} = require("../controllers/dias");

router.route("/").post(createDia);
router.route("/diasUtilizador/:utilizador").get(getAllDiasUtilizador);
router.route("/diasUtilizadorTipo/:utilizador").get(getAllDiasUtilizadorTipo);
router.route("/getAllDias").get(getAllDias);
router.route("/getAllDiasHorasExtra").get(getAllDiasHorasExtra);
router.route("/getAllDiasHorasExtraAccepted").get(getAllDiasHorasExtraAccepted);
router.route("/getAllDiasHorasExtraDeclined").get(getAllDiasHorasExtraDeclined);

router.route("/dias/:projeto").get(getAllDiasProjeto);
router.route("/diasUtilizador/:utilizador/:projeto").get(getDiasProjetoUtilizador);


//router.route("/").get(getAllProjetos);

router.route("/:user").get(getDia);
router.route("/exportDias/").post(exportDias);

router.route("/declineDiaHorasExtra/:id").patch(declineDiasHorasExtra);
router.route("/acceptDiaHorasExtra/:id").patch(acceptDiasHorasExtra);

router.route("/:id")
.delete(deleteDia)
.patch(testUser, updateDia);

module.exports = router;
