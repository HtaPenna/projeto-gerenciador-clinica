require('dotenv').config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./database"); // Importa a conexão com o banco de dados
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());       // Permite receber JSON no body da requisição

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const pacienteRoutes = require("./routes/pacienteRoutes");
app.use('/pacientes', pacienteRoutes); // Rotas acessíveis em /pacientes

const eventoRoutes = require('./routes/evento.routes');
app.use('/eventos', eventoRoutes);

const dentistaRoutes = require('./routes/dentistaRoutes');
app.use('/dentistas', dentistaRoutes);

const procedimentoRoutes = require('./routes/procedimentoRoutes');
app.use('/procedimentos', procedimentoRoutes);

const especialidadeRoutes = require('./routes/especialidadeRoutes');
app.use('/especialidades', especialidadeRoutes);

const tratamentoRoutes = require("./routes/tratamentoRoutes");
app.use("/tratamentos", tratamentoRoutes);

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use("/usuarios", usuarioRoutes);

const anamneseRoutes = require("./routes/anamneseRoutes");
app.use("/anamneses", anamneseRoutes);

const suprimentoRoutes = require("./routes/suprimentoRoutes");
app.use("/suprimentos", suprimentoRoutes);

const PORT = 3001;

sequelize.authenticate()
  .then(() => {
    console.log("Conexão com o banco estabelecida com sucesso.");
    return sequelize.sync({alter: true});  // Sincroniza (cria) as tabelas
  })
  .then(() => {
    console.log("Tabelas sincronizadas com o banco.");
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro na conexão com o banco:", err);
  });