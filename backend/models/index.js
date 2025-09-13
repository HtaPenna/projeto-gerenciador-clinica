const sequelize = require('../database');
const { DataTypes } = require('sequelize');

const Paciente = require('./paciente')(sequelize, DataTypes);
const Evento = require('./evento')(sequelize, DataTypes);
const Dentista = require('./dentista')(sequelize, DataTypes);
const Procedimento = require('./procedimento')(sequelize, DataTypes);
const Tratamento = require('./tratamento')(sequelize, DataTypes);

// Evento x Paciente
Paciente.hasMany(Evento, { foreignKey: 'id', sourceKey: 'id' });
Evento.belongsTo(Paciente, { foreignKey: 'id', targetKey: 'id' });

// Evento x Dentista
Dentista.hasMany(Evento, { foreignKey: 'id', sourceKey: 'id' });
Evento.belongsTo(Dentista, { foreignKey: 'id', targetKey: 'id' });

// Tratamentos x Dentista
Dentista.hasMany(Tratamento, { foreignKey: 'id', sourceKey: 'id' });
Tratamento.belongsTo(Dentista, { foreignKey: 'id', targetKey: 'id' });

// Procedimentos x Dentista
Dentista.hasMany(Procedimento, { foreignKey: 'id', sourceKey: 'id' });
Procedimento.belongsTo(Dentista, { foreignKey: 'id', targetKey: 'id' });

// Procedimentos x Tratamentos (opcional)
Tratamento.hasMany(Procedimento, { foreignKey: 'id' });
Procedimento.belongsTo(Tratamento, { foreignKey: 'id' });

// Evento ↔ Procedimento (N:N)
Evento.belongsToMany(Procedimento, { 
  through: 'EventoProcedimentos', // tabela de junção
  foreignKey: 'eventoId',
  otherKey: 'procedimentoId'
});

Procedimento.belongsToMany(Evento, { 
  through: 'EventoProcedimentos',
  foreignKey: 'procedimentoId',
  otherKey: 'eventoId'
});

// Evento ↔ Tratamento (N:N)
Evento.belongsToMany(Tratamento, { 
  through: 'EventoTratamentos', 
  foreignKey: 'eventoId', 
  otherKey: 'tratamentoId' 
});

Tratamento.belongsToMany(Evento, { 
  through: 'EventoTratamentos', 
  foreignKey: 'tratamentoId', 
  otherKey: 'eventoId' 
});

module.exports = {
  sequelize,
  Paciente,
  Evento,
  Dentista,
  Procedimento,
  Tratamento
};