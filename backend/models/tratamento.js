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
      type: DataTypes.ENUM('ativo', 'concluido', 'cancelado'),
      allowNull: false,
      defaultValue: 'ativo',
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },);
};
