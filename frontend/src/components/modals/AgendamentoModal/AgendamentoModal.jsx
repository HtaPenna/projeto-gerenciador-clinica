import { useState, useEffect } from "react";
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';
import AgendamentoForm from '../../forms/AgendamentoForm/AgendamentoForm.jsx';

export default function AgendamentoModal({
  isOpen,
  onClose,
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
              const resProc = await fetch(`http://localhost:3001/procedimentos/tratamento/${trat.id}`, { headers: getAuthHeaders() });
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

      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(eventoData) });

      if (res.status === 409) {
        addToast("❌ Horário indisponível! Escolha outro horário.", "error");
        return;
      }

      if (!res.ok) {
        throw new Error('Erro ao salvar evento');
      }

      addToast("Agendamento salvo com sucesso!", "success");
      onSuccess();
      setModoVisualizacao(true);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      addToast("Não foi possível salvar o agendamento.", "error");
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
      addToast("Agendamento excluído com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      addToast("Não foi possível excluir o agendamento.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agendamento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <AgendamentoForm
              modoVisualizacao={modoVisualizacao}
              pacienteInput={pacienteInput}
              onPacienteInputChange={setPacienteInput}
              pacientes={pacientes}
              showDropdown={showDropdown}
              onSelectPaciente={handleSelectPaciente}
              pacienteSelecionado={pacienteSelecionado}
              tratamentos={tratamentos}
              tratamentoSelecionado={tratamentoSelecionado}
              onTratamentoChange={setTratamentoSelecionado}
              procedimentoSelecionado={procedimentoSelecionado}
              onProcedimentoChange={setProcedimentoSelecionado}
              inicio={inicio}
              onInicioChange={setInicio}
              fim={fim}
              onFimChange={setFim}
              status={status}
              onStatusChange={setStatus}
              valorPrevisto={valorPrevisto}
              onValorPrevistoChange={setValorPrevisto}
              observacoes={observacoes}
              onObservacoesChange={setObservacoes}
              onSubmit={handleSubmit}
              onClose={onClose}
              onEdit={() => setModoVisualizacao(false)}
              onDelete={handleDelete}
              dataSelecionada={dataSelecionada}
            />
          </div>
        </div>
      </div>
    </div>
  );
}