module.exports = (sequelize, DataTypes) => {
  const Procedimento = sequelize.define('Procedimento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tratamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tratamento',
        key: 'id',
      },
    },
    eventoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'evento',
        key: 'id',
      },
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'concluído'),
      allowNull: false,
      defaultValue: 'pendente',
    },
  }, {
    tableName: 'procedimento',
  });

  const atualizarValorTratamento = async (procedimento) => {
    const Tratamento = sequelize.models.Tratamento;
    const procedimentos = await Procedimento.findAll({
      where: { tratamentoId: procedimento.tratamentoId }
    });

    const valorTotal = procedimentos.reduce((total, p) => 
      parseFloat(total) + parseFloat(p.valor), 0
    );

    await Tratamento.update(
      { valorTotal: valorTotal },
      { where: { id: procedimento.tratamentoId }, hooks: false }
    );
  };

  Procedimento.addHook('afterCreate', atualizarValorTratamento);
  Procedimento.addHook('afterUpdate', atualizarValorTratamento);
  Procedimento.addHook('afterDestroy', atualizarValorTratamento);

  return Procedimento;
};