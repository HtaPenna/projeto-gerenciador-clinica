const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Paciente = require('./paciente')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);
const Dentista = require('./dentista')(sequelize, DataTypes);

// Associações Paciente ↔ Evento
Paciente.hasMany(Evento, { foreignKey: 'pacienteId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Associações Dentista ↔ Evento
Dentista.hasMany(Evento, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Dentista, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


module.exports = {
  sequelize,
  Paciente,
  Evento,
  Dentista,
};