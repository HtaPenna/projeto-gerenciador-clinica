module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Paciente', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    nome: { 
      type: DataTypes.STRING(100), 
      allowNull: false 
    },
    telefoneCelular: { 
      type: DataTypes.STRING(15), 
      allowNull: false 
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBefore: new Date().toISOString().split('T')[0] // valida datas passadas
      }
    },
    telefoneResidencial: { type: DataTypes.STRING(14) },
    idade: { type: DataTypes.INTEGER, allowNull: false },
    peso: { type: DataTypes.STRING(8) },
    altura: { type: DataTypes.STRING(4) },
    tipoSanguineo: { type: DataTypes.STRING(3) },
    profissao: { type: DataTypes.STRING(100) },
    cpf: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    rg: { type: DataTypes.STRING(12), allowNull: false },
    endereco: { type: DataTypes.STRING(100), allowNull: false },
    cidade: { type: DataTypes.STRING(50), allowNull: false },
    estado: { type: DataTypes.STRING(50), allowNull: false },
    cep: { type: DataTypes.STRING(9), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false },
    genero: { type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'), allowNull: false },
    estadoCivil: { type: DataTypes.STRING(20) },
    nomeConjuge: { type: DataTypes.STRING(100) },
    telefoneEmergencia: { type: DataTypes.STRING(15) },
    redesSociais: { type: DataTypes.STRING(100) },
    assinatura: { type: DataTypes.TEXT },
  });
};
