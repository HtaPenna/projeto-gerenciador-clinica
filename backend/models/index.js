const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Usuario = require('./usuario')(sequelize, DataTypes);
const Paciente = require('./paciente')(sequelize, DataTypes);
const Anamnese = require('./anamnese')(sequelize, DataTypes);
const Dentista = require('./dentista')(sequelize, DataTypes);
const Especialidade = require('./especialidade')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);
const Procedimento = require('./procedimento')(sequelize, DataTypes);
const Tratamento = require('./tratamento')(sequelize, DataTypes);
const Suprimento = require('./suprimento')(sequelize, DataTypes);

// Associações Usuário ↔ Dentista/Paciente (1:1)
Dentista.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
Paciente.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

// Associações Paciente ↔ Anamnese (1:1)
Anamnese.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

// Associações Dentista ↔ Evento (1:N)
Dentista.hasMany(Evento, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Dentista, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Associações Paciente ↔ Evento (1:N)
Paciente.hasMany(Evento, { foreignKey: 'pacienteId', as: 'consulta' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

// Associações Evento ↔ Procedimentos (1:N)
Evento.hasMany(Procedimento, { foreignKey: 'eventoId', as: 'procedimento' });
Procedimento.belongsTo(Evento, { foreignKey: 'eventoId', as: 'consulta' });

// Associações Tratamento ↔ Procedimentos (1:N)
Tratamento.hasMany(Procedimento, { foreignKey: 'tratamentoId', as: 'procedimento' });
Procedimento.belongsTo(Tratamento, { foreignKey: 'tratamentoId', as: 'tratamento' });

// Associações Paciente ↔ Tratamento (1:N)
Paciente.hasMany(Tratamento, { foreignKey: 'pacienteId', as: 'tratamento' });
Tratamento.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

// Associações Dentista ↔ Especialidade (N:N)
Dentista.belongsToMany(Especialidade, { through: 'dentista_especialidade' });
Especialidade.belongsToMany(Dentista, { through: 'dentista_especialidade' });

module.exports = {
  sequelize,
  Usuario,
  Paciente,
  Anamnese,
  Dentista,
  Especialidade,
  Evento,
  Procedimento,
  Tratamento,
  Suprimento
};