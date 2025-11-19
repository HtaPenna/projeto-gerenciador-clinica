import React, { useState, useEffect } from "react";
import { useAuth } from '../../../../hooks/useAuth';
import "./Consulta.css";

const API_EVENTOS = "http://localhost:3001/eventos";

export default function Consultas({ pacienteId }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);

  const [diagnostico, setDiagnostico] = useState("");
  const [tratamentoRealizado, setTratamentoRealizado] = useState("");
  const [procedimentoRealizado, setProcedimentoRealizado] = useState("");
  const [observacoesClinicas, setObservacoesClinicas] = useState("");
  const [recomendacoes, setRecomendacoes] = useState("");
  const [anexos, setAnexos] = useState([]);

  const { getAuthHeaders } = useAuth();

  const carregarConsultas = async () => {
    if (!pacienteId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_EVENTOS}/paciente/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();

      const concluidas = data.filter(
        (consulta) => consulta.status?.toLowerCase() === "concluída"
      );

      setConsultas(concluidas);
    } catch (err) {
      console.error("Erro ao carregar consultas:", err);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, [pacienteId]);

  const abrirModal = (consulta) => {
    setConsultaSelecionada(consulta);
    const texto = consulta.descricao || "";

    const regex = /Diagnóstico:\s*([\s\S]*?)\n\nTratamento Realizado:\s*([\s\S]*?)\n\nProcedimento Realizado:\s*([\s\S]*?)\n\nObservações Clínicas:\s*([\s\S]*?)\n\nRecomendações Pós-Atendimento:\s*([\s\S]*)/;
    const match = texto.match(regex);

    if (match) {
      setDiagnostico(match[1].trim());
      setTratamentoRealizado(match[2].trim());
      setProcedimentoRealizado(match[3].trim());
      setObservacoesClinicas(match[4].trim());
      setRecomendacoes(match[5].trim());
    } else {
      const partes = texto.split("\n\n");
      setDiagnostico(partes[0] || "");
      setTratamentoRealizado(partes[1] || "");
      setProcedimentoRealizado(partes[2] || "");
      setObservacoesClinicas(partes[3] || "");
      setRecomendacoes(partes[4] || "");
    }

    setAnexos([]);
    setModalOpen(true);
  };

  const salvarDescricao = async () => {
    if (!consultaSelecionada) return;

    const descricaoFinal = `
Diagnóstico:
${diagnostico.trim()}

Tratamento Realizado:
${tratamentoRealizado.trim()}

Procedimento Realizado:
${procedimentoRealizado.trim()}

Observações Clínicas:
${observacoesClinicas.trim()}

Recomendações Pós-Atendimento:
${recomendacoes.trim()}
    `.trim();

    try {
      const response = await fetch(`${API_EVENTOS}/${consultaSelecionada.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ descricao: descricaoFinal }),
      });

      if (!response.ok) throw new Error("Erro ao salvar descrição");
      const consultaAtualizada = await response.json();

      setConsultas((prev) =>
        prev.map((c) =>
          c.id === consultaAtualizada.id ? consultaAtualizada : c
        )
      );

      setModalOpen(false);
    } catch (err) {
      console.error("Erro ao salvar descrição:", err);
    }
  };

  const handleAnexosChange = (e) => {
    const files = Array.from(e.target.files);
    setAnexos(files);
  };

  if (loading) return <div className="carregandoConsultas">Carregando consultas...</div>;

  if (consultas.length === 0) {
    return (
      <div className="consultasContainer">
        <h2>Histórico de Consultas</h2>
        <div className="semConsultas">
          Não há consultas concluídas para este paciente.
        </div>
      </div>
    );
  }

  return (
    <div className="consultasContainer">
      <h2>Histórico de Consultas</h2>

      <table className="tabelaConsultas">
        <thead>
          <tr>
            <th>Horário</th>
            <th>Tratamento</th>
            <th>Procedimento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => {
            const inicio = new Date(c.inicio).toLocaleString();
            return (
              <tr key={c.id}>
                <td>{inicio}</td>
                <td>{c.tratamento?.nome || "—"}</td>
                <td>{c.procedimento?.nome || "—"}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    onClick={() => abrirModal(c)}
                    className="btnAbrirDescricao"
                  >
                    Abrir descrição
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setModalOpen(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Descrição da Consulta</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>

              <div className="modal-body">
                <div className="campoDescricao">
                  <label>Diagnóstico:</label>
                  <textarea
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    className="textareaDescricao"
                  />
                </div>

                <div className="campoDescricao">
                  <label>Tratamento Realizado:</label>
                  <textarea
                    value={tratamentoRealizado}
                    onChange={(e) => setTratamentoRealizado(e.target.value)}
                    className="textareaDescricao"
                  />
                </div>

                <div className="campoDescricao">
                  <label>Procedimento Realizado:</label>
                  <textarea
                    value={procedimentoRealizado}
                    onChange={(e) => setProcedimentoRealizado(e.target.value)}
                    className="textareaDescricao"
                  />
                </div>

                <div className="campoDescricao">
                  <label>Observações Clínicas:</label>
                  <textarea
                    value={observacoesClinicas}
                    onChange={(e) => setObservacoesClinicas(e.target.value)}
                    className="textareaDescricao"
                  />
                </div>

                <div className="campoDescricao">
                  <label>Recomendações Pós-Atendimento:</label>
                  <textarea
                    value={recomendacoes}
                    onChange={(e) => setRecomendacoes(e.target.value)}
                    className="textareaDescricao"
                  />
                </div>

                <div className="campoDescricao">
                  <label>Anexos (opcional):</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleAnexosChange}
                    className="inputAnexos"
                  />
                  {anexos.length > 0 && (
                    <ul className="listaAnexos">
                      {anexos.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <div className="botoesModal">
                  <button onClick={() => setModalOpen(false)} className="btnCancelar">
                    Cancelar
                  </button>
                  <button onClick={salvarDescricao} className="btnSalvar">
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}