const express = require("express");
const router = express.Router();
const anamneseController = require("../controllers/anamneseController");
const { authMiddleware, dentistaAuth } = require("../middleware/auth");

router.get("/", authMiddleware, dentistaAuth, anamneseController.get);
router.get("/paciente/:pacienteId", authMiddleware, dentistaAuth, anamneseController.getById);
router.post("/", authMiddleware, dentistaAuth, anamneseController.post);
router.patch("/:id", authMiddleware, dentistaAuth, anamneseController.patch);
router.delete("/:id", authMiddleware, dentistaAuth, anamneseController.delete);

module.exports = router;
