const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Paciente = require('./paciente')(sequelize, DataTypes);
const Dentista = require('./dentista')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);
const Procedimento = require('./procedimento')(sequelize, DataTypes);
const Categoria = require('./categoria')(sequelize, DataTypes);

// Associações Paciente ↔ Evento (1:N)
Paciente.hasMany(Evento, { foreignKey: 'pacienteId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Paciente, { foreignKey: 'pacienteId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Associações Dentista ↔ Evento (1:N)
Dentista.hasMany(Evento, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Evento.belongsTo(Dentista, { foreignKey: 'dentistaId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Associações Evento ↔ Procedimento (N:N)
Evento.belongsToMany(Procedimento, { through: 'eventoseprocedimentos', foreignKey: 'eventoId', otherKey: 'procedimentoId' });
Procedimento.belongsToMany(Evento, { through: 'eventoseprocedimentos', foreignKey: 'procedimentoId', otherKey: 'eventoId' });

// Associações Categoria ↔ Procedimento (1:N)
Categoria.hasMany(Procedimento, { foreignKey: 'categoriaId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Procedimento.belongsTo(Categoria, { foreignKey: 'categoriaId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = {
  sequelize,
  Paciente,
  Dentista,
  Evento,
  Procedimento,
  Categoria,
};