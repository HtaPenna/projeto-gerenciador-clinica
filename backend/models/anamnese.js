module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Anamnese', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pacienteId: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      unique: true 
    },
    queixaPrincipal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    condicoesSaude: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('condicoesSaude');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('condicoesSaude', JSON.stringify(value));
      }
    },
    antecedentesMedicos: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    usoMedicamentos: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alergias: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sobreCicatrizacao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fumante: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    consumoBebidasAlcoolicas: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    dificuldadeRespiratoria: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    problemaDigestivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ultimoTratamento: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    satisfacaoSorriso: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    dentesBrancos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sensibilidadeDentes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    usoFioDental: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    orientacaoBucal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    desconfortoBucal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sobreMaxilar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    placaMordida: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    grauTensao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'anamnese',
  });
};