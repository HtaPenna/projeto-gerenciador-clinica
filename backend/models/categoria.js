module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Categoria', {
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
    tableName: 'categorias',
  });
};
