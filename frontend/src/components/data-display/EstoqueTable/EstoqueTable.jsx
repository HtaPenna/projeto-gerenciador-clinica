import React from 'react';
import './EstoqueTable.css';

export default function EstoqueTable({
  suprimentos,
  onEditar,
  onDeletar,
  loading = false
}) {
  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="spinner"></div>
        <p>Carregando suprimentos...</p>
      </div>
    );
  }

  if (!suprimentos || suprimentos.length === 0) {
    return (
      <div className="emptyState">
        <p>Nenhum suprimento cadastrado.</p>
      </div>
    );
  }

  return (
    <div className='estoqueTableContainer'>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Qtde Mínima</th>
            <th className="actionsHeader">Ações</th>
          </tr>
        </thead>
        <tbody>
          {suprimentos.map((suprimento) => (
            <tr
              key={suprimento.id}
              className={suprimento.Quantidade_Sup <= (suprimento.QuantidadeMin_Sup || 0) ? 'lowStock' : ''}
            >
              <td className="codeCell">{suprimento.Codigo_Sup}</td>
              <td>{suprimento.Nome_Sup}</td>
              <td>
                <span className="typeBadge">{suprimento.Tipo_Sup}</span>
              </td>
              <td className="descriptionCell">
                <span title={suprimento.Descricao_Sup}>
                  {suprimento.Descricao_Sup || '-'}
                </span>
              </td>
              <td className={suprimento.Quantidade_Sup <= (suprimento.QuantidadeMin_Sup || 0) ? 'lowQuantity' : 'normalQuantity'}>
                {suprimento.Quantidade_Sup}
              </td>
              <td className="minQuantity">{suprimento.QuantidadeMin_Sup || '-'}</td>
              <td className="actionsCell">
                <div className="actionsGroup">
                  <button
                    onClick={() => onEditar(suprimento)}
                    className="btnEdit"
                    title="Editar suprimento"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDeletar(suprimento.id)}
                    className="btnDelete"
                    title="Deletar suprimento"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}