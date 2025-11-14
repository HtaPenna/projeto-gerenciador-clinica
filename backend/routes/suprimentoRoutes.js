const express = require("express");
const router = express.Router();
const suprimentoController = require("../controllers/suprimentoController");
const { authMiddleware } = require("../middleware/auth");
const dentistaAuth = require("../middleware/dentistaAuth");

router.get("/", authMiddleware, dentistaAuth, suprimentoController.getTodos);
router.post("/", authMiddleware, dentistaAuth, suprimentoController.criar);
router.patch("/:id", authMiddleware, dentistaAuth, suprimentoController.atualizar);
router.delete("/:id", authMiddleware, dentistaAuth, suprimentoController.deletar);

module.exports = router;