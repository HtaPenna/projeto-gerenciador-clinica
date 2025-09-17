module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Procedimento', {
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
    codigoTuss: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    duracaoMinutos: {
      type: DataTypes.INTEGER,
      allowNull: true, // tempo estimado em minutos
    },
    valorParticular: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    coberturaConvenio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    valorConvenio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // pode ser diferente do valor particular
    },
    dentistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dentistas',
        key: 'id',
      },
    },
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tratamentos',
        key: 'id',
      },
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
    risco: {
      type: DataTypes.ENUM('baixo', 'moderado', 'alto'),
      allowNull: true,
    },
  }, {
    tableName: 'procedimentos',
  });
};
