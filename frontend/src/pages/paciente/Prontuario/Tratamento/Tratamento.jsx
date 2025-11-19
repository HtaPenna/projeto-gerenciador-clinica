import React, { useState, useEffect } from "react";
import { useToast } from '../../../../hooks/useToast';
import { useAuth } from '../../../../hooks/useAuth';
import { Trash, Edit, Check, X } from "lucide-react"
import "./Tratamento.css";

const API_TRATAMENTOS = "http://localhost:3001/tratamentos";
const API_PROCEDIMENTOS = "http://localhost:3001/procedimentos";
const API_ANAMNESES = "http://localhost:3001/anamneses";

export default function Tratamentos({ pacienteId }) {
  const { addToast } = useToast();
  const { getAuthHeaders } = useAuth();

  const [tratamentos, setTratamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anamnesePreenchida, setAnamnesePreenchida] = useState(false);
  const [novoTratamento, setNovoTratamento] = useState("");
  const [tratamentoEditando, setTratamentoEditando] = useState(null);
  const [procedimentoVisualizando, setProcedimentoVisualizando] = useState(null);
  const [procedimentoEditandoModal, setProcedimentoEditandoModal] = useState(null);
  const [novoProcedimentoModal, setNovoProcedimentoModal] = useState(null);
  const [novoProcedimentoDados, setNovoProcedimentoDados] = useState({
    nome: '',
    descricao: '',
    observacoes: '',
    valor: '',
    status: 'pendente'
  });

  const verificarAnamnese = async () => {
    try {
      const res = await fetch(`${API_ANAMNESES}/paciente/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        setAnamnesePreenchida(false);
        return;
      }

      if (res.ok) {
        const anamnese = await res.json();
        const preenchida = anamnese.queixaPrincipal?.trim() !== "" ||
          anamnese.condicoesSaude?.length > 0;
        setAnamnesePreenchida(preenchida);
      }
    } catch (error) {
      console.error('Erro ao verificar anamnese:', error);
      setAnamnesePreenchida(false);
    }
  };

  const carregarTratamentos = async () => {
    try {
      setLoading(true);
      await verificarAnamnese();

      const resTrat = await fetch(`${API_TRATAMENTOS}/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (!resTrat.ok) {
        if (resTrat.status === 404) {
          setTratamentos([]);
          return;
        }
        throw new Error("Erro ao carregar tratamentos");
      }

      const tratamentosData = await resTrat.json();

      const tratamentosComProcedimentos = await Promise.all(
        tratamentosData.map(async (trat) => {
          try {
            const resProc = await fetch(`${API_PROCEDIMENTOS}/tratamento/${trat.id}`, {
              headers: getAuthHeaders()
            });

            if (resProc.ok) {
              const procedimentos = await resProc.json();
              return { ...trat, procedimentos };
            } else {
              return { ...trat, procedimentos: [] };
            }
          } catch (error) {
            console.error(`Erro ao carregar procedimentos do tratamento ${trat.id}:`, error);
            return { ...trat, procedimentos: [] };
          }
        })
      );

      setTratamentos(tratamentosComProcedimentos);
    } catch (err) {
      console.error("Erro ao carregar tratamentos:", err);
      addToast("Erro ao carregar tratamentos do paciente", "error");
      setTratamentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTratamentos();
  }, [pacienteId]);

  const handleAdicionarTratamento = async (e) => {
    e.preventDefault();

    if (!anamnesePreenchida) {
      addToast("Complete a anamnese do paciente antes de criar tratamentos", "warning");
      return;
    }

    if (!novoTratamento.trim()) {
      addToast("Digite um nome para o tratamento", "warning");
      return;
    }

    try {
      const response = await fetch(API_TRATAMENTOS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pacienteId,
          nome: novoTratamento
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar tratamento");

      setNovoTratamento("");
      addToast("Tratamento adicionado com sucesso!", "success");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
      addToast("Erro ao adicionar tratamento", "error");
    }
  };

  const handleAtualizarTratamento = async (tratamentoOriginal) => {
    try {
      const response = await fetch(`${API_TRATAMENTOS}/${tratamentoEditando.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: tratamentoEditando.nome
        }),
      });

      if (response.ok) {
        // Atualiza a lista localmente primeiro
        const tratamentosAtualizados = tratamentos.map(t =>
          t.id === tratamentoEditando.id ? { ...t, nome: tratamentoEditando.nome } : t
        );
        setTratamentos(tratamentosAtualizados);

        // Só depois reseta o estado
        setTratamentoEditando(null);

        addToast('Tratamento atualizado com sucesso!', 'success');
      } else {
        throw new Error('Erro ao atualizar tratamento');
      }
    } catch (error) {
      console.error('Erro ao atualizar tratamento:', error);
      addToast('Erro ao atualizar tratamento', 'error');

      // Reverte para o nome original em caso de erro
      const tratamentosRevertidos = tratamentos.map(t =>
        t.id === tratamentoEditando.id ? tratamentoOriginal : t
      );
      setTratamentos(tratamentosRevertidos);
      setTratamentoEditando(null);
    }
  };

  const handleDeletarTratamento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este tratamento?")) return;

    try {
      const response = await fetch(`${API_TRATAMENTOS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Erro ao excluir tratamento");

      addToast("Tratamento excluído com sucesso!", "success");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir tratamento", "error");
    }
  };

  const handleAtualizarProcedimentoModal = async (proc) => {
    if (!procedimentoEditandoModal?.nome?.trim()) {
      addToast("Nome do procedimento não pode estar vazio", "warning");
      return;
    }

    try {
      const response = await fetch(`${API_PROCEDIMENTOS}/${proc.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(procedimentoEditandoModal),
      });

      if (!response.ok) throw new Error("Erro ao atualizar procedimento");

      setProcedimentoEditandoModal(null);
      setProcedimentoVisualizando(null);
      addToast("Procedimento atualizado com sucesso!", "success");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
      addToast("Erro ao atualizar procedimento", "error");
    }
  };

  const handleAdicionarProcedimentoModal = async (tratamentoId) => {
    if (!anamnesePreenchida) {
      addToast("Complete a anamnese do paciente antes de adicionar procedimentos", "warning");
      return;
    }

    if (!novoProcedimentoDados.nome?.trim()) {
      addToast("Preencha o nome do procedimento!", "warning");
      return;
    }

    try {
      const response = await fetch(API_PROCEDIMENTOS, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...novoProcedimentoDados,
          tratamentoId
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar procedimento");

      setNovoProcedimentoDados({
        nome: '',
        descricao: '',
        observacoes: '',
        valor: '',
        status: 'pendente'
      });
      setNovoProcedimentoModal(null);
      addToast("Procedimento adicionado com sucesso!", "success");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
      addToast("Erro ao adicionar procedimento", "error");
    }
  };

  const handleDeletarProcedimento = async (id) => {
    if (!window.confirm("Deseja realmente excluir este procedimento?")) return;

    try {
      const response = await fetch(`${API_PROCEDIMENTOS}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error("Erro ao excluir procedimento");

      addToast("Procedimento excluído com sucesso!", "success");
      carregarTratamentos();
    } catch (err) {
      console.error(err);
      addToast("Erro ao excluir procedimento", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2 text-muted">Carregando tratamentos...</p>
      </div>
    );
  }

  return (
    <div className="tratamentoContainer">
      <h2 className="tituloTratamentos">Tratamentos</h2>

      {!anamnesePreenchida && (
        <div className="warningAnamnese">
          <p className="titleWarning">⚠️ Anamnese Pendente ⚠️</p>
          <p>Complete a anamnese do paciente na seção "Anamnese" antes de criar tratamentos ou procedimentos.</p>
        </div>
      )}

      {anamnesePreenchida && !tratamentoEditando && (
        <form onSubmit={handleAdicionarTratamento} className="formNovoTratamento">
          <input
            type="text"
            placeholder="Novo tratamento"
            value={novoTratamento}
            onChange={(e) => setNovoTratamento(e.target.value)}
            className="inputNovoTratamento"
          />
          <button type="submit" className="btnAdicionarTratamento">
            Adicionar
          </button>
        </form>
      )}

      <div className="listaTratamentos">
        {tratamentos.map((trat) => {
          const valorTotal = trat.procedimentos?.reduce(
            (sum, p) => sum + parseFloat(p.valor || 0), 0
          ) || 0;

          return (
            <div key={trat.id} className="tratamentoCard">
              <div className="tratamentoHeader">
                {tratamentoEditando?.id === trat.id ? (
                  <div className="editTratamentoContainer">
                    <input
                      type="text"
                      value={tratamentoEditando.nome}
                      onChange={(e) => setTratamentoEditando({
                        ...tratamentoEditando,
                        nome: e.target.value,
                      })}
                      className="inputEditandoTratamento"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAtualizarTratamento(trat);
                        }
                        if (e.key === 'Escape') {
                          setTratamentoEditando(null);
                        }
                      }}
                    />
                    <div className="btnContainerEditando">
                      <button
                        onClick={() => handleAtualizarTratamento(trat)}
                        className="btnSalvarTratamento"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setTratamentoEditando(null)}
                        className="btnCancelarTratamento"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="tratamentoTitle">{trat.nome}</h3>
                    <div className="btnContainer">
                      <button
                        onClick={() => setTratamentoEditando(trat)}
                        className="tratamentoBtnEditar"
                        disabled={!anamnesePreenchida}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletarTratamento(trat.id)}
                        className="tratamentoBtnExcluir"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="procedimentosLista">
                {trat.procedimentos?.map((proc) => (
                  <div key={proc.id} className="procedimentoItem">
                    <div className="procedimentoInfo">
                      <span className="procedimentoNome">{proc.nome}</span>
                      <span className="procedimentoValor">R$ {parseFloat(proc.valor || 0).toFixed(2)}</span>
                      <div className="statusContainer">
                        <span className={`procedimentoStatus ${proc.status === "concluído" ? "statusConcluido" : "statusPendente"}`}>
                          {proc.status === "concluído" ? "Concluído" : "Pendente"}
                        </span>
                      </div>
                    </div>
                    <div className="procedimentoAcoes">
                      <button
                        onClick={() => setProcedimentoVisualizando(proc)}
                        className="btnVerMais"
                      >
                        Ver Mais
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tratamentoFooter">
                {anamnesePreenchida && (
                  <button
                    onClick={() => setNovoProcedimentoModal(trat.id)}
                    className="btnAdicionarProcedimento"
                  >
                    Adicionar Procedimento
                  </button>
                )}

                <p className="valorTotal">
                  Valor total: R$ {valorTotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {procedimentoVisualizando && (
        <div className="modal fade show d-block" tabIndex="-1" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }} onClick={() => setProcedimentoVisualizando(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{
            maxHeight: '90vh',
            margin: '5vh auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <h5 className="modal-title">
                  {procedimentoEditandoModal ? 'Editar Procedimento' : 'Detalhes do Procedimento'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setProcedimentoVisualizando(null)}></button>
              </div>

              <div className="modal-body" style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(90vh - 120px)'
              }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nome do Procedimento</label>
                    <input
                      type="text"
                      className="form-control"
                      value={procedimentoEditandoModal ? procedimentoEditandoModal.nome : procedimentoVisualizando.nome}
                      onChange={(e) => procedimentoEditandoModal && setProcedimentoEditandoModal({
                        ...procedimentoEditandoModal,
                        nome: e.target.value
                      })}
                      readOnly={!procedimentoEditandoModal}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={procedimentoEditandoModal ? procedimentoEditandoModal.descricao : procedimentoVisualizando.descricao}
                      onChange={(e) => procedimentoEditandoModal && setProcedimentoEditandoModal({
                        ...procedimentoEditandoModal,
                        descricao: e.target.value
                      })}
                      readOnly={!procedimentoEditandoModal}
                      placeholder={procedimentoVisualizando.descricao ? "" : "Nenhuma descrição informada"}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={procedimentoEditandoModal ? procedimentoEditandoModal.observacoes : procedimentoVisualizando.observacoes}
                      onChange={(e) => procedimentoEditandoModal && setProcedimentoEditandoModal({
                        ...procedimentoEditandoModal,
                        observacoes: e.target.value
                      })}
                      readOnly={!procedimentoEditandoModal}
                      placeholder={procedimentoVisualizando.observacoes ? "" : "Nenhuma observação informada"}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Valor</label>
                    <input
                      type="number"
                      className="form-control"
                      value={procedimentoEditandoModal ? procedimentoEditandoModal.valor : procedimentoVisualizando.valor}
                      onChange={(e) => procedimentoEditandoModal && setProcedimentoEditandoModal({
                        ...procedimentoEditandoModal,
                        valor: e.target.value
                      })}
                      readOnly={!procedimentoEditandoModal}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={procedimentoEditandoModal ? procedimentoEditandoModal.status : procedimentoVisualizando.status}
                      onChange={(e) => procedimentoEditandoModal && setProcedimentoEditandoModal({
                        ...procedimentoEditandoModal,
                        status: e.target.value
                      })}
                      disabled={!procedimentoEditandoModal}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="concluído">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ flexShrink: 0 }}>
                {!procedimentoEditandoModal ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setProcedimentoEditandoModal({ ...procedimentoVisualizando })}
                      disabled={!anamnesePreenchida}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setProcedimentoVisualizando(null)}
                    >
                      Fechar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleAtualizarProcedimentoModal(procedimentoVisualizando)}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setProcedimentoEditandoModal(null);
                        setProcedimentoVisualizando(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {novoProcedimentoModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }} onClick={() => setNovoProcedimentoModal(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{
            maxHeight: '90vh',
            margin: '5vh auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <h5 className="modal-title">Novo Procedimento</h5>
                <button type="button" className="btn-close" onClick={() => setNovoProcedimentoModal(null)}></button>
              </div>

              <div className="modal-body" style={{
                overflowY: 'auto',
                flex: 1,
                maxHeight: 'calc(90vh - 120px)'
              }}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Nome do Procedimento</label>
                    <input
                      type="text"
                      className="form-control"
                      value={novoProcedimentoDados.nome}
                      onChange={(e) => setNovoProcedimentoDados({ ...novoProcedimentoDados, nome: e.target.value })}
                      placeholder="Digite o nome do procedimento"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={novoProcedimentoDados.descricao}
                      onChange={(e) => setNovoProcedimentoDados({ ...novoProcedimentoDados, descricao: e.target.value })}
                      placeholder="Descreva o procedimento"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={novoProcedimentoDados.observacoes}
                      onChange={(e) => setNovoProcedimentoDados({ ...novoProcedimentoDados, observacoes: e.target.value })}
                      placeholder="Observações adicionais"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Valor</label>
                    <input
                      type="number"
                      className="form-control"
                      value={novoProcedimentoDados.valor}
                      onChange={(e) => setNovoProcedimentoDados({ ...novoProcedimentoDados, valor: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={novoProcedimentoDados.status}
                      onChange={(e) => setNovoProcedimentoDados({ ...novoProcedimentoDados, status: e.target.value })}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="concluído">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleAdicionarProcedimentoModal(novoProcedimentoModal)}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setNovoProcedimentoModal(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}