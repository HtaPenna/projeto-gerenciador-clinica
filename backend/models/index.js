const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Paciente = require('./paciente')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);

Paciente.hasMany(Evento, { foreignKey: 'pacienteId', sourceKey: 'id' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', targetKey: 'id' });


module.exports = {
  sequelize,
  Paciente,
  Evento,
};