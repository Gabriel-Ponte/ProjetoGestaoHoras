const express = require("express");

const router = express.Router();

const {
    getAllFerias,
    addDiasFeriasUtilizador,
    deleteDiasFerias,
    getFeriasUtilizador,
    getAllFeriasGroup,
    exportFerias
} = require("../controllers/ferias");

router.route("/getAllFerias").get(getAllFerias);

router.route("/feriasGroup/:utilizador").get(getAllFeriasGroup);
router.route("/addDiasFeriasUtilizador").post(addDiasFeriasUtilizador);

router.route("/:id").delete(deleteDiasFerias).get(getFeriasUtilizador);
router.route("/exportFerias/").post(exportFerias);


module.exports = router;
