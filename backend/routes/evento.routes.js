const express = require("express");
const router = express.Router();
const eventoController = require("../controllers/eventoController");

router.get("/", eventoController.get);         // GET /eventos
router.post("/", eventoController.post);           // POST /eventos
router.patch("/:id", eventoController.patch);   // PATCH /eventos/:id
router.delete("/:id", eventoController.delete);    // DELETE /eventos/:id

module.exports = router;
