module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Tratamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paciente',
        key: 'id',
      },
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    valorTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
  }, {
    tableName: 'tratamento',
  });
};