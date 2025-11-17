const { Usuario, Dentista, Paciente } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginAttempts = {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15min

function isBlocked(email) {
  const attempt = loginAttempts[email];
  return attempt && attempt.blockUntil > Date.now();
}

exports.register = async (req, res) => {
  try {
    const { email, senha, tipo, nome, cro, enderecoConsultorio, telefoneConsultorio } = req.body;

    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaForteRegex.test(senha)) {
      return res.status(400).json({
        error: "Senha fraca! Use 8+ caracteres com maiúscula, minúscula, número e símbolo."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await Usuario.create({
      email,
      senha: senhaHash,
      tipo: tipo
    });

    if (tipo === "dentista") {
      await Dentista.create({
        userId: novoUsuario.id,
        nome: nome || email.split('@')[0], // nome ou parte do email
        cro: cro || "000000", // CRO temporário
        enderecoConsultorio: enderecoConsultorio || "Endereço a definir",
        telefoneConsultorio: telefoneConsultorio || "11999999999"
      });
    }

    res.status(201).json({ 
        message: `${tipo} criado com sucesso!`, 
        id: novoUsuario.id,
        tipo: novoUsuario.tipo 
    });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // VALIDAÇÃO DO JWT_SECRET
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        message: "Configuração do servidor incompleta" 
      });
    }

    if (isBlocked(email))
      return res.status(403).json({ message: "Muitas tentativas. Aguarde alguns minutos." });

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count++;
      if (loginAttempts[email].count >= MAX_ATTEMPTS)
        loginAttempts[email].blockUntil = Date.now() + BLOCK_TIME;

      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) {
      loginAttempts[email] = loginAttempts[email] || { count: 0 };
      loginAttempts[email].count++;
      if (loginAttempts[email].count >= MAX_ATTEMPTS)
        loginAttempts[email].blockUntil = Date.now() + BLOCK_TIME;

      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    delete loginAttempts[email];

    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    let name = user.email.split("@")[0];

    if (user.tipo === "dentista") {
      const dentista = await Dentista.findOne({ where: { userId: user.id } });
      if (dentista?.nome) name = dentista.nome;
    } else if (user.tipo === "paciente") {
      const paciente = await Paciente.findOne({ where: { userId: user.id } });
      if (paciente?.nome) name = paciente.nome;
    }

    res.json({ 
        token, user: { 
            id: user.id, 
            email: user.email, 
            tipo: user.tipo, 
            name,
            acessoLimitado: user.tipo === 'paciente'
        }
    });

  } catch (err) {
    res.status(500).json({ message: "Erro no servidor", erro: err.message });
  }
};
