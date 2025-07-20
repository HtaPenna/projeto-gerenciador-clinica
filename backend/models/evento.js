module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Evento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pacientes',
        key: 'Codigo_Pac',
      }
    },
  });
};
