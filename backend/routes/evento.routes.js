const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

router.get("/", eventoController.getTodos);         // GET /eventos
router.post("/", eventoController.criar);           // POST /eventos
router.patch("/:id", eventoController.atualizar);   // PATCH /eventos/:id
router.delete("/:id", eventoController.deletar);    // DELETE /eventos/:id
router.post("/com-procedimentos", eventoController.criarComProcedimentos);

module.exports = router;
