const express = require("express");
const router = express.Router();
const procedimentoController = require("../controllers/procedimentoController");

// Rotas CRUD para Procedimentos
router.get("/", procedimentoController.getTodos);         // GET /procedimentos
router.post("/", procedimentoController.criar);           // POST /procedimentos
router.patch("/:id", procedimentoController.atualizar);   // PATCH /procedimentos/:id
router.delete("/:id", procedimentoController.deletar);    // DELETE /procedimentos/:id

module.exports = router;
