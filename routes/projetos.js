const express = require("express");

const router = express.Router();

const {
  getAllProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  exportProjetos,
  getClientesProjeto,
  updateProjetoLink,
  getProjetoTodasVersoes,
} = require("../controllers/projetos");

router.route("/").post(createProjeto).get(getAllProjetos);
router.route("/clientes").get(getClientesProjeto);

router.route("/export/").post(exportProjetos);

router.route("/updateLink/:id").patch(updateProjetoLink);

router.route("/todasVersoes/:id").get(getProjetoTodasVersoes);
router
  .route("/:id")
  .get(getProjeto)
  .delete(deleteProjeto)
  .patch(updateProjeto);

module.exports = router;
