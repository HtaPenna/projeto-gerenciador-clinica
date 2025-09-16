const express = require("express");
const router = express.Router();
const dentistaController = require("../controllers/dentistaController");

router.get("/", dentistaController.getTodos);         // GET /dentistas
router.post("/", dentistaController.criar);           // POST /dentistas
router.patch("/:id", dentistaController.atualizar);   // PATCH /dentistas/:id
router.delete("/:id", dentistaController.deletar);    // DELETE /dentistas/:id

module.exports = router;
