const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, usuarioController.get);
router.post("/", authMiddleware, usuarioController.post);
router.patch("/:id", authMiddleware, usuarioController.patch);
router.delete("/:id", authMiddleware, usuarioController.delete);

module.exports = router;