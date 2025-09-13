// models/tratamento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Tratamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dentistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dentistas',
        key: 'id',
      },
    },
  }, {
    tableName: 'tratamentos',
    timestamps: false,
  });
};
