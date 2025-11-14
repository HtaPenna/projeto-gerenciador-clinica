const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");
const { authMiddleware } = require("../middleware/auth");
const dentistaAuth = require("../middleware/dentistaAuth");

router.get("/", authMiddleware, dentistaAuth, pacienteController.get);
router.get("/:id", authMiddleware, dentistaAuth, pacienteController.getById);
router.post("/", authMiddleware, dentistaAuth, pacienteController.post);
router.patch("/:id", authMiddleware, dentistaAuth, pacienteController.patch);
router.delete("/:id", authMiddleware, dentistaAuth, pacienteController.delete);
router.post("/cadastro-completo", authMiddleware, dentistaAuth, pacienteController.cadastroCompleto);

module.exports = router;