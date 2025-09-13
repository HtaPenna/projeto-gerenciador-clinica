// models/procedimento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Procedimento', {
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
    duracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: true, // pode ser usado para cálculo automático de horários
    },
    dentistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dentistas',
        key: 'id',
      },
    },
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: true, // pode estar desvinculado
      references: {
        model: 'tratamentos',
        key: 'id',
      },
    },
  }, {
    tableName: 'procedimentos',
    timestamps: false,
  });
};
