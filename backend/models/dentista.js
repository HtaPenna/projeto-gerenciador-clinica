// models/dentista.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Dentista', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    cro: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    enderecoConsultorio: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefoneConsultorio: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    logoConsultorio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'dentista',
  });
};
