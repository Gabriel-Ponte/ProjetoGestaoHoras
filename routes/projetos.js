const express = require("express");
const testUser = require("../middleware/testeUser");

const router = express.Router();

const {
  getAllProjetos,
  getProjeto,
  createProjeto,
  updateProjeto,
  deleteProjeto,
} = require("../controllers/projetos");

router.route("/").post(createProjeto).get(getAllProjetos);
//router.route("/").get(getAllProjetos);

router
  .route("/:id")
  .get(getProjeto)
  .delete(deleteProjeto)
  .patch(testUser, updateProjeto);

module.exports = router;
