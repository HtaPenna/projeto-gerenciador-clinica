module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Paciente', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
      unique: true 
    },
    dentistaId: { 
      type: DataTypes.INTEGER, 
      allowNull: true 
    },
    nome: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    cpf: { 
      type: DataTypes.STRING(11), 
      allowNull: false, 
      unique: true 
    },
    email: { 
      type: DataTypes.STRING(150), 
      allowNull: false 
    },
    telefoneCelular: { 
      type: DataTypes.STRING(11), 
      allowNull: false 
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBefore: new Date().toISOString().split('T')[0]
      }
    },
    telefoneResidencial: { 
      type: DataTypes.STRING(14) 
    },
    telefoneEmergencia: { 
      type: DataTypes.STRING(15) 
    },
    cep: { 
      type: DataTypes.STRING(9), 
      allowNull: false 
    },
    logradouro: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    bairro: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    cidade: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    estado: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    genero: { 
      type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'), 
      allowNull: false 
    },
    peso: { 
      type: DataTypes.STRING(8) 
    },
    altura: { 
      type: DataTypes.STRING(4) 
    },
    tipoSanguineo: { 
      type: DataTypes.STRING(3) 
    },    
    estadoCivil: { 
      type: DataTypes.STRING(20) 
    },
    nomeConjuge: { 
      type: DataTypes.STRING(100) 
    },
    profissao: { 
      type: DataTypes.STRING(100) 
    },
    redesSociais: { 
      type: DataTypes.STRING(100) 
    },
    assinatura: { 
      type: DataTypes.TEXT 
    },
  }, {
    tableName: 'paciente',
  });
};