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

<<<<<<< HEAD
router.route("/:id").delete(deleteDiasFerias).get(getFeriasUtilizador);
=======
router.route("/:id").get(getFeriasUtilizador).delete(deleteDiasFerias);
>>>>>>> 493ca391511a8fef4d9eac4d0a749b0bb864100e

module.exports = router;
