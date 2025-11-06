// models/evento.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Evento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dentistaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'dentista',
        key: 'id',
      },
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paciente',
        key: 'id',
      },
    },
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tratamento',
        key: 'id',
      },
    },
    procedimentoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'procedimento',
        key: 'id',
      },
    },
    inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fim: {
      type: DataTypes.DATE,
      allowNull: true,
    },   
    status: {
      type: DataTypes.ENUM('agendada', 'confirmada', 'concluída', 'indisponível'),
      allowNull: false,
      defaultValue: 'agendada',
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valorPrevisto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
  },
  {
    tableName: 'evento',
  });
};
