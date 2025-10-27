const express = require("express");
const router = express.Router();
const anamneseController = require("../controllers/anamneseController");

// Rotas CRUD para Tratamentos
router.get("/", anamneseController.get);          // GET /anamnese
router.get("/paciente/:pacienteId", anamneseController.getById);          // GET /anamnese/paciente/:pacienteId
router.post("/", anamneseController.post);            // POST /anamnese
router.patch("/:id", anamneseController.patch);    // PATCH /anamnese/:id
router.delete("/:id", anamneseController.delete);     // DELETE /anamnese/:id

module.exports = router;
