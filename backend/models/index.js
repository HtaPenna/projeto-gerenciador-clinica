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

Dentista.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });
Paciente.belongsTo(Usuario, { foreignKey: 'userId', as: 'usuario' });

Anamnese.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Dentista.hasMany(Evento, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Dentista, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Paciente.hasMany(Evento, { foreignKey: 'pacienteId', as: 'consulta' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Evento.belongsTo(Tratamento, { foreignKey: 'tratamentoId', as: 'tratamento' });
Evento.belongsTo(Procedimento, { foreignKey: 'procedimentoId', as: 'procedimento' });

Tratamento.hasMany(Evento, { foreignKey: 'tratamentoId', as: 'eventos' });
Procedimento.hasMany(Evento, { foreignKey: 'procedimentoId', as: 'eventos' });

Tratamento.hasMany(Procedimento, { foreignKey: 'tratamentoId', as: 'procedimento' });
Procedimento.belongsTo(Tratamento, { foreignKey: 'tratamentoId', as: 'tratamento' });

Paciente.hasMany(Tratamento, { foreignKey: 'pacienteId', as: 'tratamento' });
Tratamento.belongsTo(Paciente, { foreignKey: 'pacienteId', as: 'paciente' });

Dentista.belongsToMany(Especialidade, { through: 'dentista_especialidade' });
Especialidade.belongsToMany(Dentista, { through: 'dentista_especialidade' });

Dentista.hasMany(Suprimento, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Suprimento.belongsTo(Dentista, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

const initDatabase = async (options = {}) => {
  try {
    const syncOptions = {
      force: false,
      alter: true,
      logging: console.log,
      ...options
    };
    
    await sequelize.sync(syncOptions);
    console.log('Banco sincronizado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao sincronizar banco:', error);
    return false;
  }
};

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
  Suprimento,
  initDatabase
};