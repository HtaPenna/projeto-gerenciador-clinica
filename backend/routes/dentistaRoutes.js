const express = require("express");
const router = express.Router();
const dentistaController = require("../controllers/dentistaController");
const { authMiddleware } = require("../middleware/auth");
const dentistaAuth = require("../middleware/dentistaAuth");

router.get("/", authMiddleware, dentistaAuth, dentistaController.getTodos);
router.post("/", authMiddleware, dentistaAuth, dentistaController.criar);
router.patch("/:id", authMiddleware, dentistaAuth, dentistaController.atualizar);
router.delete("/:id", authMiddleware, dentistaAuth, dentistaController.deletar);

module.exports = router;
