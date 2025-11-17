import React from 'react';
import './EstoqueTable.css'; // Vamos criar o CSS também

export default function EstoqueTable({ 
  suprimentos, 
  onEditar, 
  onDeletar,
  loading = false
}) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2 text-muted">Carregando suprimentos...</p>
      </div>
    );
  }

  if (!suprimentos || suprimentos.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">Nenhum suprimento cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive estoque-table">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Nome</th>
            <th scope="col">Tipo</th>
            <th scope="col">Descrição</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Qtde Mínima</th>
            <th scope="col" className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {suprimentos.map((suprimento) => (
            <tr key={suprimento.id} className={suprimento.Quantidade_Sup <= (suprimento.QuantidadeMin_Sup || 0) ? 'table-warning' : ''}>
              <td className="fw-bold">{suprimento.Codigo_Sup}</td>
              <td>{suprimento.Nome_Sup}</td>
              <td>
                <span className="badge bg-secondary">{suprimento.Tipo_Sup}</span>
              </td>
              <td>
                <span className="text-truncate" title={suprimento.Descricao_Sup}>
                  {suprimento.Descricao_Sup || '-'}
                </span>
              </td>
              <td>
                <span className={
                  suprimento.Quantidade_Sup <= (suprimento.QuantidadeMin_Sup || 0) 
                    ? 'text-danger fw-bold' 
                    : 'text-success fw-bold'
                }>
                  {suprimento.Quantidade_Sup}
                </span>
              </td>
              <td>{suprimento.QuantidadeMin_Sup || '-'}</td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    onClick={() => onEditar(suprimento)}
                    className="btn btn-outline-primary btn-sm"
                    title="Editar suprimento"
                  >
                    <i className="bi bi-pencil"></i> Editar
                  </button>
                  <button
                    onClick={() => onDeletar(suprimento.id)}
                    className="btn btn-outline-danger btn-sm"
                    title="Deletar suprimento"
                  >
                    <i className="bi bi-trash"></i> Excluir
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