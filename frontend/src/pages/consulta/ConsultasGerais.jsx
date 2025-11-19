import React, { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAuth } from '../../hooks/useAuth';
import ConsultaTable from "../../components/data-display/ConsultaTable/ConsultaTable.jsx";

const API_URL = "http://localhost:3001/eventos";

import './ConsultasGerais.css';

export default function HistoricoConsultas() {
  const { updateTitle } = usePageTitle();
  const [eventos, setEventos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Estados para o modal de descrição
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamentoRealizado, setTratamentoRealizado] = useState("");
  const [procedimentoRealizado, setProcedimentoRealizado] = useState("");
  const [observacoesClinicas, setObservacoesClinicas] = useState("");
  const [recomendacoes, setRecomendacoes] = useState("");
  const [anexos, setAnexos] = useState([]);

  useEffect(() => {
    updateTitle("Histórico de Consultas");
  }, [updateTitle]);

  const { getAuthHeaders } = useAuth();

  const carregarPacientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/pacientes", { headers: getAuthHeaders() });
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      const data = await res.json();
      setEventos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPacientes();
    carregarEventos();
  }, []);

  // Filtros
  const eventosFiltrados = eventos.filter((e) => {
    if (e.status === "indisponível") return false;
    const pacienteOk = filtroPaciente ? e.pacienteId === parseInt(filtroPaciente) : true;
    const statusOk = filtroStatus ? e.status === filtroStatus : true;
    return pacienteOk && statusOk;
  });

  const concluidas = eventosFiltrados.filter((e) => e.status === "concluída");
  const outras = eventosFiltrados.filter((e) => e.status !== "concluída");

  // Abrir modal - COM A MESMA LÓGICA DO CONSULTAS.JSX
  const abrirModal = (consulta) => {
    setEventoSelecionado(consulta);
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

  // Salvar descrição - ATUALIZADA COM A MESMA LÓGICA
  const salvarDescricao = async () => {
    if (!eventoSelecionado) return;

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
      const response = await fetch(`${API_URL}/${eventoSelecionado.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ descricao: descricaoFinal }),
      });

      if (!response.ok) throw new Error("Erro ao salvar descrição");
      const consultaAtualizada = await response.json();

      setEventos((prev) =>
        prev.map((c) =>
          c.id === consultaAtualizada.id ? consultaAtualizada : c
        )
      );

      setModalOpen(false);

      // Tratar anexos se necessário
      if (anexos.length > 0) {
        console.log('Anexos para upload:', anexos);
      }

    } catch (err) {
      console.error("Erro ao salvar descrição:", err);
    }
  };

  // Handler para anexos
  const handleAnexosChange = (e) => {
    const files = Array.from(e.target.files);
    setAnexos(files);
  };

  // Atualizar status
  // No ConsultasGerais.jsx - função atualizarStatus
  const atualizarStatus = async (id, novoStatus) => {
    try {
      console.log('Atualizando status:', id, 'para:', novoStatus);
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: novoStatus }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const eventoAtualizado = await response.json();
      console.log('Status atualizado com sucesso:', eventoAtualizado);

      // Atualizar o estado global - ISSO É ESSENCIAL
      setEventos((prev) =>
        prev.map((e) => (e.id === eventoAtualizado.id ? eventoAtualizado : e))
      );
      
      return eventoAtualizado;
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      throw err;
    }
  };

  const verProntuario = (pacienteId) => {
    window.location.href = `/main/pacientes/${pacienteId}/prontuario`;
  };

  return (
    <div className="container mt-4">

      {/* Filtros */}
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-sm-6 col-md-4">
          <label className="form-label">Paciente</label>
          <select
            value={filtroPaciente}
            onChange={(e) => setFiltroPaciente(e.target.value)}
            className="form-select"
          >
            <option value="">Todos</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-3">
          <label className="form-label">Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="form-select"
          >
            <option value="">Todos</option>
            <option value="agendada">Agendada</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabelas Componentizadas */}
      <div className="mb-4">
        <ConsultaTable
          consultas={concluidas}
          tipo="concluída"
          onAbrirDescricao={abrirModal}
          onVerProntuario={verProntuario}
          onAtualizarStatus={atualizarStatus}
        />
      </div>

      <div>
        <ConsultaTable
          consultas={outras}
          tipo="outras"
          onAbrirDescricao={abrirModal}
          onVerProntuario={verProntuario}
          onAtualizarStatus={atualizarStatus}
        />
      </div>

      {/* Modal de Descrição - MESMA ESTRUTURA DO CONSULTAS.JSX */}
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