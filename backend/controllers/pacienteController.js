const { Sequelize } = require('sequelize');
const { Paciente, Usuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.get = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      where: { dentistaId: req.dentista.id },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT MAX(e.inicio)
              FROM evento AS e
              WHERE e.pacienteId = paciente.id
              AND e.status = 'concluída'
            )`),
            'ultimaConsulta'
          ]
        ]
      },
      order: [['nome', 'ASC']],
    });
    res.json(pacientes || []);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

exports.getById = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id 
      }
    });
    
    if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.post = async (req, res) => {
  try {
    const pacienteData = { ...req.body, dentistaId: req.dentista.id };
    const novoPaciente = await Paciente.create(pacienteData);
    res.status(201).json(novoPaciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.patch = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id 
      }
    });
    
    if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" });
    await paciente.update(req.body);
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Paciente.destroy({ 
      where: { 
        id: req.params.id,
        dentistaId: req.dentista.id 
      } 
    });
    
    if (deleted) {
      res.json({ message: "Paciente removido com sucesso" });
    } else {
      res.status(404).json({ error: "Paciente não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cadastroCompleto = async (req, res) => {
  try {
    const { nome, cpf, email, telefoneCelular, dataNascimento, telefoneResidencial, telefoneEmergencia, cep, logradouro, bairro, cidade, estado, genero, peso, altura, tipoSanguineo, estadoCivil, nomeConjuge, profissao, redesSociais, assinatura } = req.body;

    const camposObrigatorios = ['nome', 'cpf', 'email', 'telefoneCelular', 'dataNascimento', 'cep', 'logradouro', 'bairro', 'cidade', 'estado', 'genero'];
    
    for (const campo of camposObrigatorios) {
      if (!req.body[campo]) {
        return res.status(400).json({ error: `Campo obrigatório faltando: ${campo}` });
      }
    }

    const senhaTemporaria = Math.random().toString(36).slice(-8) + 'A1!';
    
    const usuario = await Usuario.create({
      email,
      senha: await bcrypt.hash(senhaTemporaria, 10),
      tipo: 'paciente'
    });

    const paciente = await Paciente.create({
      userId: usuario.id,
      dentistaId: req.dentista.id,
      nome, cpf, email, telefoneCelular, dataNascimento,
      telefoneResidencial: telefoneResidencial || null,
      telefoneEmergencia: telefoneEmergencia || null,
      cep, logradouro, bairro, cidade, estado, genero,
      peso: peso || null, altura: altura || null,
      tipoSanguineo: tipoSanguineo || null, estadoCivil: estadoCivil || null,
      nomeConjuge: nomeConjuge || null, profissao: profissao || null,
      redesSociais: redesSociais || null, assinatura: assinatura || null
    });

    console.log('Paciente cadastrado - Email:', email, 'Senha:', senhaTemporaria);

    res.status(201).json(paciente);
  } catch (err) {
    console.error('Erro no cadastro completo:', err.message);
    res.status(400).json({ error: err.message });
  }
};