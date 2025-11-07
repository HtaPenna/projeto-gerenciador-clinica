import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { usePageTitle } from "../../hooks/usePageTitle";

const API_URL = "http://localhost:3001/eventos";

Modal.setAppElement("#root");

export default function HistoricoConsultas() {
  const { updateTitle } = usePageTitle();
  const [eventos, setEventos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // Controle do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const [diagnostico, setDiagnostico] = useState("");
  const [tratamentoRealizado, setTratamentoRealizado] = useState("");
  const [procedimentoRealizado, setProcedimentoRealizado] = useState("");
  const [observacoesClinicas, setObservacoesClinicas] = useState("");
  const [recomendacoes, setRecomendacoes] = useState("");
  const [anexos, setAnexos] = useState([]);

  useEffect(() => {
    updateTitle("Histórico de Consultas");
  }, [updateTitle]);

  const carregarPacientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/pacientes");
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL);
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

  // Abrir modal
  const abrirModal = (consulta) => {
    setEventoSelecionado(consulta);
    const texto = consulta.descricao || "";

    const regex =
      /Diagnóstico:\s*([\s\S]*?)\n\nTratamento Realizado:\s*([\s\S]*?)\n\nProcedimento Realizado:\s*([\s\S]*?)\n\nObservações Clínicas:\s*([\s\S]*?)\n\nRecomendações Pós-Atendimento:\s*([\s\S]*)/;
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

    setAnexos([]); // limpa anexos ao abrir
    setModalOpen(true);
  };

  // Salvar descrição
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
        headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      console.error("Erro ao salvar descrição:", err);
    }
  };

  const handleAnexosChange = (e) => {
    const files = Array.from(e.target.files);
    setAnexos(files);
  };

  // Atualizar status
  const atualizarStatus = async (id, novoStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar status");
      const eventoAtualizado = await response.json();

      setEventos((prev) =>
        prev.map((e) => (e.id === eventoAtualizado.id ? eventoAtualizado : e))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const verProntuario = (pacienteId) => {
    window.location.href = `/main/pacientes/${pacienteId}/prontuario`;
  };

  return (
    <div className="p-6" style={{ marginLeft: "100px" }}>
      <h1 className="text-2xl font-bold mb-6">Histórico de Consultas</h1>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <label className="flex flex-col">
          <span className="text-sm text-gray-600">Paciente</span>
          <select
            value={filtroPaciente}
            onChange={(e) => setFiltroPaciente(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todos</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-600">Status</span>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todos</option>
            <option value="agendada">Agendada</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
      </div>

      {/* Consultas Concluídas */}
      <div className="bg-green-50 border border-green-300 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-green-700 mb-3">
          Consultas Concluídas ({concluidas.length})
        </h2>

        {concluidas.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-2 border">Paciente</th>
                <th className="p-2 border">Tratamento</th>
                <th className="p-2 border">Procedimento</th>
                <th className="p-2 border">Data / Hora</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {concluidas.map((evento) => (
                <tr key={evento.id} className="hover:bg-green-50">
                  <td className="p-2 border">{evento.paciente?.nome || "—"}</td>
                  <td className="p-2 border">{evento.tratamento?.nome || "—"}</td>
                  <td className="p-2 border">{evento.procedimento?.nome || "—"}</td>
                  <td className="p-2 border">
                    {new Date(evento.inicio).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-2 border">
                    <select
                      value={evento.status}
                      onChange={(e) => atualizarStatus(evento.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="agendada">Agendada</option>
                      <option value="concluída">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal(evento)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Abrir descrição
                    </button>
                    <button
                      onClick={() => verProntuario(evento.pacienteId)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver prontuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-sm">
            Nenhuma consulta concluída encontrada.
          </p>
        )}
      </div>

      {/* Outras Consultas */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-yellow-700 mb-3">
          Outras Consultas ({outras.length})
        </h2>

        {outras.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-100 text-left">
                <th className="p-2 border">Paciente</th>
                <th className="p-2 border">Tratamento</th>
                <th className="p-2 border">Procedimento</th>
                <th className="p-2 border">Data / Hora</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {outras.map((evento) => (
                <tr key={evento.id} className="hover:bg-yellow-50">
                  <td className="p-2 border">{evento.paciente?.nome || "—"}</td>
                  <td className="p-2 border">{evento.tratamento?.nome || "—"}</td>
                  <td className="p-2 border">{evento.procedimento?.nome || "—"}</td>
                  <td className="p-2 border">
                    {new Date(evento.inicio).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-2 border">
                    <select
                      value={evento.status}
                      onChange={(e) => atualizarStatus(evento.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="agendada">Agendada</option>
                      <option value="concluída">Concluída</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </td>
                  <td className="p-2 border text-center flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal(evento)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Abrir descrição
                    </button>
                    <button
                      onClick={() => verProntuario(evento.pacienteId)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Ver prontuário
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 text-sm">Nenhuma consulta encontrada.</p>
        )}
      </div>

      {/* Modal de Descrição */}
      <Modal
              isOpen={modalOpen}
              onRequestClose={() => setModalOpen(false)}
              contentLabel="Descrição da Consulta"
              style={{
                content: {
                  top: "50%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  transform: "translate(-50%, -50%)",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                  width: "100%",
                  maxWidth: "35rem",
                  maxHeight: "90vh",
                  overflowY: "auto",
                },
                overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
              }}
            >
              <h2 className="text-lg font-bold mb-3">Descrição da Consulta</h2>
      
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold mb-1">Diagnóstico:</label>
                  <textarea
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    className="w-full border p-2 rounded min-h-[80px]"
                  />
                </div>
      
                <div>
                  <label className="block font-semibold mb-1">Tratamento Realizado:</label>
                  <textarea
                    value={tratamentoRealizado}
                    onChange={(e) => setTratamentoRealizado(e.target.value)}
                    className="w-full border p-2 rounded min-h-[80px]"
                  />
                </div>
      
                <div>
                  <label className="block font-semibold mb-1">Procedimento Realizado:</label>
                  <textarea
                    value={procedimentoRealizado}
                    onChange={(e) => setProcedimentoRealizado(e.target.value)}
                    className="w-full border p-2 rounded min-h-[80px]"
                  />
                </div>
      
                <div>
                  <label className="block font-semibold mb-1">Observações Clínicas:</label>
                  <textarea
                    value={observacoesClinicas}
                    onChange={(e) => setObservacoesClinicas(e.target.value)}
                    className="w-full border p-2 rounded min-h-[80px]"
                  />
                </div>
      
                <div>
                  <label className="block font-semibold mb-1">
                    Recomendações Pós-Atendimento:
                  </label>
                  <textarea
                    value={recomendacoes}
                    onChange={(e) => setRecomendacoes(e.target.value)}
                    className="w-full border p-2 rounded min-h-[80px]"
                  />
                </div>
      
                <div>
                  <label className="block font-semibold mb-1">Anexos (opcional):</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleAnexosChange}
                    className="block w-full border p-2 rounded"
                  />
                  {anexos.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-2 list-disc pl-5">
                      {anexos.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
      
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarDescricao}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Salvar
                </button>
              </div>
            </Modal>
    </div>
  );
}
