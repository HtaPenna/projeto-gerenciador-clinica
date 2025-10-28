const express = require("express");
const router = express.Router();
const suprimentoController = require("../controllers/suprimentoController");

router.get("/", suprimentoController.getTodos);         // GET /dentistas
router.post("/", suprimentoController.criar);           // POST /dentistas
router.patch("/:id", suprimentoController.atualizar);   // PATCH /dentistas/:id
router.delete("/:id", suprimentoController.deletar);    // DELETE /dentistas/:id

module.exports = router;
