/**module.exports = [
  { id: 1, nome: "João da Silva", email: "joao@exemplo.com" },
  { id: 2, nome: "Maria Oliveira", email: "maria@exemplo.com" }
];**/

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Paciente', {
    Codigo_Pac: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Nome_Pac: { type: DataTypes.STRING(100), allowNull: false },
    Tel_Pac: { type: DataTypes.STRING(15), allowNull: false },
    DataNasc_Pac: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBefore: new Date().toISOString().split('T')[0] // valida datas passadas
      }
    },
    TelResid_Pac: DataTypes.STRING(14),
    Idade_Pac: { type: DataTypes.INTEGER, allowNull: false },
    Peso_Pac: DataTypes.STRING(8),
    Altura_Pac: DataTypes.STRING(4),
    TipoSang_Pac: DataTypes.STRING(3),
    Profissao_Pac: DataTypes.STRING(100),
    CPF_Pac: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    RG_Pac: { type: DataTypes.STRING(12), allowNull: false },
    Endereco_Pac: { type: DataTypes.STRING(100), allowNull: false },
    Cidade_Pac: { type: DataTypes.STRING(50), allowNull: false },
    Estado_Pac: { type: DataTypes.STRING(50), allowNull: false },
    CEP_Pac: { type: DataTypes.STRING(9), allowNull: false },
    Email_Pac: { type: DataTypes.STRING(50), allowNull: false },
    Sexo_Pac: { type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'), allowNull: false },
    EstCivil_Pac: DataTypes.STRING(20),
    NomeConjuge_Pac: DataTypes.STRING(100),
    TelEmergencia_Pac: DataTypes.STRING(15),
    RedesSociais_Pac: DataTypes.STRING(100),
    Assinatura_Pac: DataTypes.TEXT,
  });
};
