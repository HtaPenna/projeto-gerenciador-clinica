import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AgendamentoForm({
  isOpen,
  onRequestClose,
  dataSelecionada,
  onSuccess,
  dentistaId,
  modoVisualizacao = false,
  setModoVisualizacao,
}) {
  const [pacienteNome, setPacienteNome] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [status, setStatus] = useState("agendada");
  const [valorPrevisto, setValorPrevisto] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // 🔹 Preenche os campos quando o modal abre
  useEffect(() => {
    if (dataSelecionada) {
      setPacienteNome(dataSelecionada.title || "");
      setInicio(dataSelecionada.start ? formatDateTimeLocal(dataSelecionada.start) : "");
      setFim(dataSelecionada.end ? formatDateTimeLocal(dataSelecionada.end) : "");
      setStatus(dataSelecionada.status || "agendada");
      setValorPrevisto(dataSelecionada.valorPrevisto || "");
      setObservacoes(dataSelecionada.observacoes || "");
    }
  }, [dataSelecionada]);

  // 🔹 Função auxiliar para formato ISO local (input datetime-local)
  function formatDateTimeLocal(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${da}T${h}:${mi}`;
  }

  // 🔹 Salvar ou atualizar evento
  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventoData = {
      title: pacienteNome,
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
      dentistaId,
      status,
      valorPrevisto: parseFloat(valorPrevisto) || 0,
      observacoes,
    };

    try {
      const url = dataSelecionada?.id
        ? `http://localhost:3001/eventos/${dataSelecionada.id}`
        : "http://localhost:3001/eventos";
      const method = dataSelecionada?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoData),
      });

      if (!res.ok) throw new Error("Erro ao salvar evento");

      onSuccess();
      onRequestClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Não foi possível salvar o evento.");
    }
  };

  // 🔹 Excluir evento
  const handleDelete = async () => {
    if (!dataSelecionada?.id) return;
    const confirmar = window.confirm("Deseja realmente excluir este agendamento?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/eventos/${dataSelecionada.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir evento");
      onSuccess();
      onRequestClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir o evento.");
    }
  };

  // 🔹 Habilita edição
  const habilitarEdicao = () => setModoVisualizacao(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Agendamento"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          width: "100%",
          maxWidth: "28rem",
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          color: "#1a202c",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50 },
      }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
        {modoVisualizacao
          ? "Detalhes do Agendamento"
          : dataSelecionada?.id
          ? "Editar Agendamento"
          : "Novo Agendamento"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Paciente */}
        <div>
          <label className="block mb-1 font-medium">Paciente</label>
          <input
            type="text"
            value={pacienteNome}
            onChange={(e) => setPacienteNome(e.target.value)}
            disabled={modoVisualizacao}
            placeholder="Nome do paciente"
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Início */}
        <div>
          <label className="block mb-1 font-medium">Início</label>
          <input
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Fim */}
        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="concluída">Concluída</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
        </div>

        {/* Valor Previsto */}
        <div>
          <label className="block mb-1 font-medium">Valor Previsto</label>
          <input
            type="number"
            step="0.01"
            value={valorPrevisto}
            onChange={(e) => setValorPrevisto(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Observações */}
        <div>
          <label className="block mb-1 font-medium">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${
              modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Fechar
          </button>

          {modoVisualizacao ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={habilitarEdicao}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Salvar
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
