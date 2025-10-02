// models/evento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Evento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fim: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes',
        key: 'id',
      },
    },
    dentistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dentistas',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmada', 'em_andamento', 'concluida', 'bloqueado'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    valorPrevisto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
};
