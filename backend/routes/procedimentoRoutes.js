const express = require("express");
const router = express.Router();
const procedimentoController = require("../controllers/procedimentoController");
const { authMiddleware, dentistaAuth } = require("../middleware/auth");

router.get('/tratamento/:tratamentoId', authMiddleware, dentistaAuth, procedimentoController.getPorTratamento);
router.post('/', authMiddleware, dentistaAuth, procedimentoController.criar);
router.patch('/:id', authMiddleware, dentistaAuth, procedimentoController.atualizar);
router.delete('/:id', authMiddleware, dentistaAuth, procedimentoController.deletar);

module.exports = router;