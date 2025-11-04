import { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

export default function NovoEventoModal({ isOpen, onRequestClose, dataSelecionada, onSuccess, dentistaId }) {
  const dataBase = (() => {
    if (!dataSelecionada) return new Date();
    if (dataSelecionada instanceof Date) return dataSelecionada;
    if (dataSelecionada.start) return new Date(dataSelecionada.start);
    if (dataSelecionada.inicio) return new Date(dataSelecionada.inicio);
    return new Date();
  })();

  // --- Estados principais ---
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState(formatDateTimeLocal(dataBase));
  const [fim, setFim] = useState(formatDateTimeLocal(new Date(dataBase.getTime() + 60 * 60 * 1000)));
  const [status, setStatus] = useState("agendada");
  const [valorPrevisto, setValorPrevisto] = useState("0.00");
  const [observacoes, setObservacoes] = useState("");

  const [pacienteInput, setPacienteInput] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [tratamentos, setTratamentos] = useState([]);
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);

  // --- 1️⃣ Carregar dados do evento do BD quando abrir (modo visualização/edição) ---
  useEffect(() => {
    if (isOpen && dataSelecionada?.id) {
      fetch(`http://localhost:3001/eventos/${dataSelecionada.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar evento");
          return res.json();
        })
        .then(async (evento) => {
          // Atualiza campos principais
          setTitulo(evento.title || "");
          setInicio(formatDateTimeLocal(evento.inicio));
          setFim(formatDateTimeLocal(evento.fim));
          setStatus(evento.status || "agendada");
          setValorPrevisto(evento.valorPrevisto || "0.00");
          setObservacoes(evento.observacoes || "");

          // Busca paciente
          if (evento.pacienteId) {
            const resPac = await fetch(`http://localhost:3001/pacientes/${evento.pacienteId}`);
            if (resPac.ok) {
              const paciente = await resPac.json();
              setPacienteSelecionado(paciente);
              setPacienteInput(paciente.nome);
            }
          }

          // Busca tratamentos do paciente e seleciona o correto
          if (evento.tratamentoId && evento.pacienteId) {
            const resTrat = await fetch(`http://localhost:3001/tratamentos/${evento.pacienteId}`);
            if (resTrat.ok) {
              const listaTrat = await resTrat.json();

              // Adiciona os procedimentos de cada tratamento
              const tratamentosComProcedimentos = await Promise.all(
                listaTrat.map(async (trat) => {
                  const resProc = await fetch(`http://localhost:3001/procedimentos/tratamento/${trat.id}`);
                  const procedimentos = resProc.ok ? await resProc.json() : [];
                  return { ...trat, procedimentos };
                })
              );

              setTratamentos(tratamentosComProcedimentos);

              // Seleciona o tratamento e o procedimento correspondentes
              const tSel = tratamentosComProcedimentos.find((t) => t.id === evento.tratamentoId);
              setTratamentoSelecionado(tSel || null);

              if (tSel && evento.procedimentoId) {
                const pSel = tSel.procedimentos.find((p) => p.id === evento.procedimentoId);
                setProcedimentoSelecionado(pSel || null);
              }
            }
          }
        })
        .catch((err) => console.error("Erro ao carregar evento:", err));
    } else if (isOpen && !dataSelecionada?.id) {
      // 🔹 Caso seja novo evento, reseta o formulário
      resetarFormulario();
    }
  }, [isOpen, dataSelecionada]);

  // --- 2️⃣ Buscar pacientes conforme digitação ---
  useEffect(() => {
    if (pacienteInput.length > 0 && status !== "indisponível") {
      fetch(`http://localhost:3001/pacientes?search=${pacienteInput}`)
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
      setPacientes([]);
      setShowDropdown(false);
    }
  }, [pacienteInput, status]);

  // --- 3️⃣ Atualiza o título automaticamente ---
  useEffect(() => {
    if (status === "indisponível") setTitulo("Indisponível");
    else if (pacienteSelecionado) setTitulo(pacienteSelecionado.nome);
    else setTitulo("");
  }, [status, pacienteSelecionado]);

  const handleSelectPaciente = (p) => {
    setPacienteSelecionado(p);
    setPacienteInput(p.nome);
    setShowDropdown(false);
  };

  // --- 4️⃣ Submeter formulário ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "indisponível" && !pacienteSelecionado) {
      alert("Selecione um paciente válido!");
      return;
    }

    const eventoData = {
      title: titulo,
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
      pacienteId: pacienteSelecionado?.id || null,
      dentistaId: dentistaId || null,
      status,
      valorPrevisto: parseFloat(valorPrevisto),
      observacoes,
      tratamentoId: tratamentoSelecionado?.id || null,
      procedimentoId: procedimentoSelecionado?.id || null,
    };

    try {
      const url = dataSelecionada?.id
        ? `http://localhost:3001/eventos/${dataSelecionada.id}`
        : "http://localhost:3001/eventos";
      const method = dataSelecionada?.id ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventoData),
      });

      onSuccess();
      onRequestClose();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento.");
    }
  };

  function resetarFormulario() {
    setTitulo("");
    setInicio(formatDateTimeLocal(dataBase));
    setFim(formatDateTimeLocal(new Date(dataBase.getTime() + 60 * 60 * 1000)));
    setStatus("agendada");
    setValorPrevisto("0.00");
    setObservacoes("");
    setPacienteInput("");
    setPacienteSelecionado(null);
    setTratamentos([]);
    setTratamentoSelecionado(null);
    setProcedimentoSelecionado(null);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Novo Evento"
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
          maxWidth: "28rem",
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          color: "#1a202c",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 50 },
      }}
    >
      <h2 className="text-xl font-bold mb-4">
        {dataSelecionada?.id ? "Visualizar/Editar Evento" : "Novo Evento"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paciente */}
        {status !== "indisponível" && (
          <div className="relative">
            <label className="block mb-1 font-medium">Paciente</label>
            <input
              type="text"
              placeholder="Digite o nome do paciente"
              value={pacienteInput}
              onChange={(e) => {
                setPacienteInput(e.target.value);
                setPacienteSelecionado(null);
                setShowDropdown(true);
              }}
              onFocus={() => pacienteInput && setShowDropdown(true)}
              className="w-full p-2 border rounded"
            />
            {showDropdown && pacientes.length > 0 && (
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
        )}

        {/* Tratamento e Procedimento */}
        {pacienteSelecionado && tratamentos.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Tratamento</label>
            <select
              value={tratamentoSelecionado?.id || ""}
              onChange={(e) => {
                const sel = tratamentos.find((t) => t.id === parseInt(e.target.value));
                setTratamentoSelecionado(sel || null);
                setProcedimentoSelecionado(null);
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
          <input type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input type="datetime-local" value={fim} onChange={(e) => setFim(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
            <option value="agendada">Agendada</option>
            <option value="confirmada">Confirmada</option>
            <option value="concluída">Concluída</option>
            <option value="indisponível">Indisponível</option>
          </select>
        </div>

        {/* Valor Previsto */}
        <div>
          <label className="block mb-1 font-medium">Valor Previsto</label>
          <input type="number" step="0.01" value={valorPrevisto} onChange={(e) => setValorPrevisto(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        {/* Observações */}
        <div>
          <label className="block mb-1 font-medium">Observações</label>
          <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-gray-300 rounded">
            Fechar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}

function formatDateTimeLocal(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${da}T${h}:${mi}`;
}
