const express = require("express");
const cors = require("cors");
const sequelize = require("./database"); // Importa a conexão com o banco de dados
const { DataTypes } = require("sequelize");
const Paciente = require("./models/paciente")(sequelize, DataTypes);

const app = express();
app.use(cors());               // Permite requisições de outros domínios (ex: React)
app.use(express.json());       // Permite receber JSON no body da requisição

const pacienteRoutes = require("./routes/pacienteRoutes");
app.use("/pacientes", pacienteRoutes); // Rotas acessíveis em /pacientes

const PORT = 3001;

sequelize.authenticate()
  .then(() => {
    console.log("Conexão com o banco estabelecida com sucesso.");
    return sequelize.sync();  // Sincroniza (cria) as tabelas
  })
  .then(() => {
    console.log("Tabelas sincronizadas com o banco.");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro na conexão com o banco:", err);
  });