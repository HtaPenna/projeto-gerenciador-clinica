import { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function AgendamentoRapidoModal({
  isOpen,
  onRequestClose,
  onSuccess,
  dentistaId,
}) {
  const [modoVisualizacao, setModoVisualizacao] = useState(false);

  const [pacienteInput, setPacienteInput] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [tratamentos, setTratamentos] = useState([]);
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);

  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [status, setStatus] = useState("agendada");
  const [valorPrevisto, setValorPrevisto] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // 🔹 Função auxiliar: formata data p/ datetime-local
  function formatDateTimeLocal(date) {
    if (!date) return "";
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${da}T${h}:${mi}`;
  }

  // 🔹 Define horário padrão ao abrir modal
  useEffect(() => {
    if (isOpen) {
      const agora = new Date();
      const fimPadrao = new Date(agora.getTime() + 30 * 60 * 1000);
      setInicio(formatDateTimeLocal(agora));
      setFim(formatDateTimeLocal(fimPadrao));
      setModoVisualizacao(false);
      setPacienteInput("");
      setPacienteSelecionado(null);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
      setStatus("agendada");
      setValorPrevisto("");
      setObservacoes("");
    }
  }, [isOpen]);

  // 🔹 Buscar pacientes conforme digitação
  useEffect(() => {
    if (pacienteInput.length > 0 && !modoVisualizacao) {
      fetch(`http://localhost:3001/pacientes?search=${pacienteInput}`)
        .then((res) => res.json())
        .then((data) => {
          const filtrados = data
            .filter((p) =>
              p.nome.toLowerCase().includes(pacienteInput.toLowerCase())
            )
            .sort((a, b) => a.nome.localeCompare(b.nome));
          setPacientes(filtrados);
          setShowDropdown(true);
        })
        .catch((err) => console.error("Erro ao buscar pacientes:", err));
    } else {
      setShowDropdown(false);
    }
  }, [pacienteInput, modoVisualizacao]);

  // 🔹 Buscar tratamentos do paciente selecionado
  useEffect(() => {
    if (pacienteSelecionado) {
      fetch(`http://localhost:3001/tratamentos/${pacienteSelecionado.id}`)
        .then((res) => res.json())
        .then(async (dataTrat) => {
          const tratamentosComProcedimentos = await Promise.all(
            dataTrat.map(async (trat) => {
              const resProc = await fetch(
                `http://localhost:3001/procedimentos/tratamento/${trat.id}`
              );
              const procedimentos = resProc.ok ? await resProc.json() : [];
              return { ...trat, procedimentos };
            })
          );
          setTratamentos(tratamentosComProcedimentos);
        })
        .catch((err) => console.error("Erro ao buscar tratamentos:", err));
    } else {
      setTratamentos([]);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
    }
  }, [pacienteSelecionado]);

  // 🔹 Selecionar paciente do dropdown
  const handleSelectPaciente = (p) => {
    setPacienteSelecionado(p);
    setPacienteInput(p.nome);
    setShowDropdown(false);
  };

  // 🔹 Salvar evento
  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventoData = {
      title: pacienteInput || "Agendamento rápido",
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
      dentistaId,
      status,
      valorPrevisto: parseFloat(valorPrevisto) || 0,
      observacoes,
      pacienteId: pacienteSelecionado?.id || null,
      tratamentoId: tratamentoSelecionado?.id || null,
      procedimentoId: procedimentoSelecionado?.id || null,
    };

    try {
      const res = await fetch("http://localhost:3001/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoData),
      });

      if (!res.ok) throw new Error("Erro ao salvar evento");
      onSuccess?.();
      onRequestClose();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Não foi possível salvar o agendamento.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "28rem",
          borderRadius: "0.75rem",
          padding: "1.5rem",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50 },
      }}
    >
      <h2 className="text-xl font-bold mb-4 text-center">Agendamento Rápido</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Paciente */}
        <div className="relative">
          <label className="block mb-1 font-medium">Paciente</label>
          <input
            type="text"
            placeholder="Digite o nome do paciente"
            value={pacienteInput}
            onChange={(e) => {
              setPacienteInput(e.target.value);
              if (!modoVisualizacao) setShowDropdown(true);
            }}
            onFocus={() => pacienteInput && setShowDropdown(true)}
            disabled={modoVisualizacao}
            className="w-full p-2 border rounded"
          />
          {showDropdown && pacientes.length > 0 && !modoVisualizacao && (
            <ul className="absolute z-50 w-full bg-white border mt-1 max-h-40 overflow-auto rounded shadow">
              {pacientes.map((p) => (
                <li
                  key={p.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectPaciente(p);
                  }}
                >
                  {p.nome}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tratamento */}
        {pacienteSelecionado && tratamentos.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Tratamento</label>
            <select
              value={tratamentoSelecionado?.id || ""}
              onChange={(e) => {
                const sel = tratamentos.find(
                  (t) => t.id === parseInt(e.target.value)
                );
                setTratamentoSelecionado(sel || null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione um tratamento</option>
              {tratamentos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Procedimento */}
        {tratamentoSelecionado &&
          tratamentoSelecionado.procedimentos?.length > 0 && (
            <div>
              <label className="block mb-1 font-medium">Procedimento</label>
              <select
                value={procedimentoSelecionado?.id || ""}
                onChange={(e) => {
                  const sel = tratamentoSelecionado.procedimentos.find(
                    (p) => p.id === parseInt(e.target.value)
                  );
                  setProcedimentoSelecionado(sel || null);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione um procedimento</option>
                {tratamentoSelecionado.procedimentos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Início e Fim */}
        <div>
          <label className="block mb-1 font-medium">Início</label>
          <input
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="concluída">Concluída</option>
            <option value="indisponível">Indisponível</option>
          </select>
        </div>

        {/* Valor e observações */}
        <div>
          <label className="block mb-1 font-medium">Valor Previsto</label>
          <input
            type="number"
            step="0.01"
            value={valorPrevisto}
            onChange={(e) => setValorPrevisto(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Observações</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Botões */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
