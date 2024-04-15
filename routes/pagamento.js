const express = require("express");

const router = express.Router();

const {
  addPagamentosUtilizador,
  getAllPagamentosUtilizador,
  getAllPagamentosUtilizadorResponsavel,
  getAllPagamentos,
  getPagamentosUtilizadorMes,
} = require("../controllers/pagamentos");

router.route("/getAllPagamentos").get(getAllPagamentos);

router.route("/addPagamentosUtilizador").post(addPagamentosUtilizador);
router.route("/getAllPagamentosUtilizador/:id").get(getAllPagamentosUtilizador);
router.route("/getAllPagamentosUtilizadorResponsavel/:id").get(getAllPagamentosUtilizadorResponsavel);
router.route("/getPagamentosUtilizadorMes").post(getPagamentosUtilizadorMes);

module.exports = router;
