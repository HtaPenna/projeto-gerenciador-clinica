const express = require("express");
const router = express.Router();
const pacienteController = require("../controllers/pacienteController");

router.get("/", pacienteController.getTodos);         // GET /pacientes
router.post("/", pacienteController.criar);           // POST /pacientes
router.patch("/:id", pacienteController.atualizar);   // PATCH /pacientes/:id
router.delete("/:id", pacienteController.deletar);    // DELETE /pacientes/:id

module.exports = router;