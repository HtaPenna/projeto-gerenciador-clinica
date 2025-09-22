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
    status: {
      type: DataTypes.ENUM('ativo', 'inativo'),
      allowNull: false,
      defaultValue: 'ativo',
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valorPrevisto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
  }, {
    tableName: 'tratamentos', 
  });
};
