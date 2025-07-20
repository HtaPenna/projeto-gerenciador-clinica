const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Paciente = require('./paciente')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);

Paciente.hasMany(Evento, { foreignKey: 'pacienteId', sourceKey: 'Codigo_Pac' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', targetKey: 'Codigo_Pac' });


module.exports = {
  sequelize,
  Paciente,
  Evento,
};