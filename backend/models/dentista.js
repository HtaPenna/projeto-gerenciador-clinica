// models/dentista.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Dentista', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cro: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true, // garante que não haja CRO duplicado
    },
    enderecoConsultorio: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefoneConsultorio: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    logoConsultorio: {
      type: DataTypes.TEXT, // pode armazenar base64 ou URL
      allowNull: true,
    },
  }, {
    tableName: 'dentistas',
  });
};
