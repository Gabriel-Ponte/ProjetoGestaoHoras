const express = require("express");

const router = express.Router();

const {
    getAllFerias,
    addDiasFeriasUtilizador,
    deleteDiasFerias,
    getFeriasUtilizador
} = require("../controllers/ferias");

router.route("/getAllFerias").get(getAllFerias);
router.route("/addDiasFeriasUtilizador").post(addDiasFeriasUtilizador);

router.route("/:id").get(getFeriasUtilizador).delete(deleteDiasFerias);

module.exports = router;
