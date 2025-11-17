const express = require("express");
const router = express.Router();
const especialidadeController = require("../controllers/especialidadeController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, especialidadeController.getTodos);
router.post("/", authMiddleware, especialidadeController.criar);
router.patch("/:id", authMiddleware, especialidadeController.atualizar);
router.delete("/:id", authMiddleware, especialidadeController.deletar);

module.exports = router;
