import React, { useState, useEffect } from "react";
import Modal from "react-modal";

const API_EVENTOS = "http://localhost:3001/eventos";
Modal.setAppElement("#root");

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
  const [anexos, setAnexos] = useState([]); // arquivos enviados

  const carregarConsultas = async () => {
    if (!pacienteId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_EVENTOS}/paciente/${pacienteId}`);
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
        headers: { "Content-Type": "application/json" },
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

  if (loading) return <p>Carregando consultas...</p>;
  if (consultas.length === 0)
    return <p>Não há consultas concluídas para este paciente.</p>;

  return (
    <div>
      <h2>Histórico de Consultas Concluídas</h2>
      <table className="tabela-consultas">
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
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Abrir descrição
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal */}
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
