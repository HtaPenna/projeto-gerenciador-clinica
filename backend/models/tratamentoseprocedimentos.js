module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TratamentosEprocedimentos', {
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tratamentos',
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
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    }
  }, {
    tableName: 'tratamentoseprocedimentos',
  });
};
