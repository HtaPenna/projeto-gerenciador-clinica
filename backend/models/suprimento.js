// models/suprimento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Suprimento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Codigo_Sup: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    Nome_Sup: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Tipo_Sup: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Descricao_Sup: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Quantidade_Sup: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    QuantidadeMin_Sup: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'suprimento', // nome da tabela no banco
  });
};
