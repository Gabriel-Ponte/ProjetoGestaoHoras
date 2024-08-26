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
  createDiaDomingo,
  getDiaID,
  getAllDiasHorasExtraResponsavel,
  getAllDiasHorasExtraAcceptedResponsavel,
  getAllDiasHorasExtraDeclinedResponsavel,
  adicionarFerias,
  declineMultipleDiasHorasExtra,
  acceptMultipleDiasHorasExtra,
  deleteDiaGroup,
} = require("../controllers/dias");

router.route("/").post(createDia);
router.route("/domingo").post(createDiaDomingo);
router.route("/addFerias").post(adicionarFerias);
router.route("/diasUtilizador/:utilizador").get(getAllDiasUtilizador);
router.route("/diasUtilizadorTipo/:utilizador").get(getAllDiasUtilizadorTipo);

router.route("/getAllDias").get(getAllDias);
router.route("/getAllDiasHorasExtra").get(getAllDiasHorasExtra);
router.route("/getAllDiasHorasExtraAccepted").get(getAllDiasHorasExtraAccepted);
router.route("/getAllDiasHorasExtraDeclined").get(getAllDiasHorasExtraDeclined);

router.route("/getAllDiasHorasExtraResponsavel").get(getAllDiasHorasExtraResponsavel);
router.route("/getAllDiasHorasExtraAcceptedResponsavel").get(getAllDiasHorasExtraAcceptedResponsavel);
router.route("/getAllDiasHorasExtraDeclinedResponsavel").get(getAllDiasHorasExtraDeclinedResponsavel);



router.route("/dias/:projeto").get(getAllDiasProjeto);
router.route("/diasUtilizador/:utilizador/:projeto").get(getDiasProjetoUtilizador);


//router.route("/").get(getAllProjetos);
router.route("/getDiaID/:id").get(getDiaID);
router.route("/:user").get(getDia);
router.route("/exportDias/").post(exportDias);



router.route("/declineMultipleDiaHorasExtra/:id").patch(declineMultipleDiasHorasExtra);
router.route("/acceptMultipleDiaHorasExtra/:id").patch(acceptMultipleDiasHorasExtra);

router.route("/declineDiaHorasExtra/:id").patch(declineDiasHorasExtra);
router.route("/acceptDiaHorasExtra/:id").patch(acceptDiasHorasExtra);

router.route("/group/:id").delete(deleteDiaGroup);

router.route("/:id")
.delete(deleteDia)
.patch(testUser, updateDia);

module.exports = router;
