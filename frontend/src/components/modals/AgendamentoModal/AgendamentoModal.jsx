import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';

Modal.setAppElement("#root");

export default function AgendamentoModal({
  isOpen,
  onRequestClose,
  dataSelecionada,
  onSuccess,
  dentistaId,
}) {
  const { addToast } = useToast();
  const { getAuthHeaders } = useAuth();
  const [modoVisualizacao, setModoVisualizacao] = useState(true);

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

  // Formata data para o input datetime-local
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

  // Preenche os campos ao abrir modal
  useEffect(() => {
    if (dataSelecionada && dataSelecionada.id) {
      // Modo visualização — evento existente
      setPacienteInput(dataSelecionada.pacienteNome || dataSelecionada.title || "");
      setInicio(formatDateTimeLocal(dataSelecionada.start));
      setFim(formatDateTimeLocal(dataSelecionada.end));
      setStatus(dataSelecionada.status || "agendada");
      setValorPrevisto(dataSelecionada.valorPrevisto || "");
      setObservacoes(dataSelecionada.observacoes || "");
      setModoVisualizacao(true);
    } else {
      // Modo criação — novo evento
      setPacienteInput("");
      setPacienteSelecionado(null);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
      setInicio(formatDateTimeLocal(dataSelecionada?.start || new Date()));
      setFim(formatDateTimeLocal(dataSelecionada?.end || new Date()));
      setStatus("agendada");
      setValorPrevisto("");
      setObservacoes("");
      setModoVisualizacao(false);
    }
  }, [dataSelecionada]);


  // Buscar pacientes conforme digitação
  useEffect(() => {
    if (pacienteInput.length > 0 && !modoVisualizacao) {
      fetch(`http://localhost:3001/pacientes?search=${pacienteInput}`, { headers: getAuthHeaders() })
        .then((res) => res.json())
        .then((data) => {
          const filtrados = data
            .filter((p) => p.nome.toLowerCase().includes(pacienteInput.toLowerCase()))
            .sort((a, b) => a.nome.localeCompare(b.nome));
          setPacientes(filtrados);
          setShowDropdown(true);
        })
        .catch((err) => console.error(err));
    } else {
      setShowDropdown(false);
    }
  }, [pacienteInput, modoVisualizacao]);

  // Buscar tratamentos do paciente selecionado
  useEffect(() => {
    if (pacienteSelecionado) {
      fetch(`http://localhost:3001/tratamentos/${pacienteSelecionado.id}`, { headers: getAuthHeaders() })
        .then((res) => res.json())
        .then(async (dataTrat) => {
          const tratamentosComProcedimentos = await Promise.all(
            dataTrat.map(async (trat) => {
              const resProc = await fetch(`http://localhost:3001/tratamentos/${trat.id}/procedimentos`, { headers: getAuthHeaders() });
              const procedimentos = resProc.ok ? await resProc.json() : [];
              return { ...trat, procedimentos };
            })
          );
          setTratamentos(tratamentosComProcedimentos);
        })
        .catch((err) => console.error(err));
    } else {
      setTratamentos([]);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
    }
  }, [pacienteSelecionado]);

  const handleSelectPaciente = (p) => {
    setPacienteSelecionado(p);
    setPacienteInput(p.nome);
    setShowDropdown(false);
  };

  // Salvar ou atualizar evento
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 DADOS DO EVENTO:", {
      pacienteInput,
      inicio,
      fim,
      dentistaId,
      pacienteSelecionado,
      tratamentoSelecionado,
      procedimentoSelecionado
    });

    const eventoData = {
      title: pacienteInput,
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
      const url = dataSelecionada?.id
        ? `http://localhost:3001/eventos/${dataSelecionada.id}`
        : "http://localhost:3001/eventos";
      const method = dataSelecionada?.id ? "PATCH" : "POST";

      console.log("📤 Enviando para:", url, method);

      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(eventoData) });

      if (res.status === 409) {
        addToast("❌ Horário indisponível! Escolha outro horário.", "error");
        return; // 👈 PARA AQUI - não dá throw
      }

      if (!res.ok) {
        throw new Error('Erro ao salvar evento');
      }

      console.log("📥 Resposta status:", res.status);

      const responseData = await res.json();
      console.log("📥 Resposta data:", responseData);

      if (!res.ok) throw new Error("Erro ao salvar evento");
      console.log("✅ Evento salvo com sucesso!");
      onSuccess();
      setModoVisualizacao(true);
      onRequestClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Não foi possível salvar o evento.");
    }
  };

  // Excluir evento
  const handleDelete = async () => {
    if (!dataSelecionada?.id) return;
    const confirmar = window.confirm("Deseja realmente excluir este agendamento?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/eventos/${dataSelecionada.id}`, { method: "DELETE", headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Erro ao excluir evento");
      onSuccess();
      onRequestClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir o evento.");
    }
  };

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
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
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
                const sel = tratamentos.find((t) => t.id === parseInt(e.target.value));
                setTratamentoSelecionado(sel || null);
              }}
              disabled={modoVisualizacao}
              className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
        {tratamentoSelecionado && tratamentoSelecionado.procedimentos?.length > 0 && (
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
              disabled={modoVisualizacao}
              className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            disabled={modoVisualizacao}
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
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
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          >
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="concluída">Concluída</option>
            <option value="indisponível">Indisponível</option>
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
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
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
            className={`w-full p-2 border rounded ${modoVisualizacao ? "bg-gray-100 cursor-not-allowed" : ""
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
                onClick={() => setModoVisualizacao(false)}
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
