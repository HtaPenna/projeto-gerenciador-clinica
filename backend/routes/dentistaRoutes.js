const express = require("express");
const router = express.Router();
const dentistaController = require("../controllers/dentistaController");
const { authMiddleware, dentistaAuth } = require("../middleware/auth");

router.get("/", authMiddleware, dentistaAuth, dentistaController.getTodos);
router.get("/me", authMiddleware, dentistaAuth, dentistaController.getMe);
router.post("/", authMiddleware, dentistaAuth, dentistaController.criar);
router.patch("/dados-pessoais", authMiddleware, dentistaAuth, dentistaController.atualizarDadosPessoais);
router.patch("/dados-clinica", authMiddleware, dentistaAuth, dentistaController.atualizarDadosClinica);
router.patch("/alterar-senha", authMiddleware, dentistaAuth, dentistaController.alterarSenha);
router.patch("/:id", authMiddleware, dentistaAuth, dentistaController.atualizar);
router.delete("/:id", authMiddleware, dentistaAuth, dentistaController.deletar);

module.exports = router;