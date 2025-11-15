// routes/tratamentoRoutes.js
const express = require("express");
const router = express.Router();
const tratamentoController = require("../controllers/tratamentoController");
const { authMiddleware, dentistaAuth } = require("../middleware/auth");

router.get("/", authMiddleware, dentistaAuth, tratamentoController.getTodos);
router.get('/:pacienteId', authMiddleware, dentistaAuth, tratamentoController.getTratamentos);
router.post("/", authMiddleware, dentistaAuth, tratamentoController.criar);
router.patch("/:id", authMiddleware, dentistaAuth, tratamentoController.atualizar);
router.delete("/:id", authMiddleware, dentistaAuth, tratamentoController.deletar);
router.get("/:id/procedimentos", authMiddleware, dentistaAuth, tratamentoController.getProcedimentos);

module.exports = router;
