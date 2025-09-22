module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PacientesEtratamentos', {
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pacientes',
        key: 'id',
      },
    },
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tratamentos',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em_andamento', 'concluido', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'pacientesetratamentos',
  });
};
