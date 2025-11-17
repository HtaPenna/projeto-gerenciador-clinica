module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Especialidade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'especialidade',
  });
};