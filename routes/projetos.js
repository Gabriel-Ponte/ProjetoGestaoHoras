const express = require("express");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const {
  getAllProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  exportProjetos,
} = require("../controllers/projetos");

router.route("/").post(createProjeto).get(getAllProjetos);
//router.route("/").get(getAllProjetos);

router.route("/export/").post(exportProjetos);
router
  .route("/:id")
  .get(getProjeto)
  .delete(deleteProjeto)
  .patch(testUser, updateProjeto);

module.exports = router;
