const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());               // Permite requisições de outros domínios (ex: React)
app.use(express.json());       // Permite receber JSON no body da requisição

const pacienteRoutes = require("./routes/pacienteRoutes");
app.use("/pacientes", pacienteRoutes); // Rotas acessíveis em /pacientes

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));