const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");
const { authMiddleware, dentistaAuth } = require("../middleware/auth");

router.get("/", authMiddleware, dentistaAuth, eventoController.get);
router.get("/paciente/:pacienteId", authMiddleware, dentistaAuth, eventoController.getByPacienteId);
router.get("/procedimento/:procedimentoId", authMiddleware, dentistaAuth, eventoController.getByProcedimentoId);
router.post("/", authMiddleware, dentistaAuth, eventoController.post);
router.patch("/:id", authMiddleware, dentistaAuth, eventoController.patch);
router.delete("/:id", authMiddleware, dentistaAuth, eventoController.delete);
router.get("/:id/procedimentos", authMiddleware, dentistaAuth, eventoController.getProcedimentos);

module.exports = router;