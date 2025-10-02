module.exports = (sequelize, DataTypes) => {
  return sequelize.define('EventosEprocedimentos', {
    eventoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'eventos',
        key: 'id',
      },
    },
    procedimentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'procedimentos',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pendente', 'realizado', 'cancelado'),
      allowNull: false,
      defaultValue: '',
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'eventoseprocedimentos',
  });
};
