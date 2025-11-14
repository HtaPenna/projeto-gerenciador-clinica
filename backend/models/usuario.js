module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Usuario', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    email: { 
      type: DataTypes.STRING(150), 
      unique: true, 
      allowNull: false 
    },
    senha: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    tipo: { 
      type: DataTypes.ENUM('dentista', 'paciente'), 
      allowNull: false 
    },
  }, { 
    tableName: 'usuario'
  });
};