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
  config
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
  const [procedimentos, setProcedimentos] = useState([]);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [status, setStatus] = useState("agendada");
  const [valorPrevisto, setValorPrevisto] = useState("");
  const [observacoes, setObservacoes] = useState("");

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

  const validarHorarioExpediente = (inicio, fim) => {
    if (!config?.slotMinTime || !config?.slotMaxTime) return true;

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    const horaInicio = inicioDate.getHours() + inicioDate.getMinutes() / 60;
    const horaFim = fimDate.getHours() + fimDate.getMinutes() / 60;

    const [minHours, minMinutes] = config.slotMinTime.split(':');
    const [maxHours, maxMinutes] = config.slotMaxTime.split(':');

    const minExpediente = parseInt(minHours) + parseInt(minMinutes) / 60;
    const maxExpediente = parseInt(maxHours) + parseInt(maxMinutes) / 60;

    if (horaInicio < minExpediente || horaFim > maxExpediente) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    // Reset quando modal fecha
    if (!isOpen) {
      setPacienteInput("");
      setPacienteSelecionado(null);
      setPacientes([]);
      setShowDropdown(false);
      setTratamentos([]);
      setTratamentoSelecionado(null);
      setProcedimentos([]);
      setProcedimentoSelecionado(null);
      setInicio("");
      setFim("");
      setStatus("agendada");
      setValorPrevisto("");
      setObservacoes("");
      setModoVisualizacao(true);
      return;
    }

    const isNovoAgendamento = !dataSelecionada?.id;

    if (isNovoAgendamento) {
      setPacienteInput("");
      setPacienteSelecionado(null);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
      setTratamentos([]);
      setProcedimentos([]);

      const dataBase = dataSelecionada?.start || new Date();
      setInicio(formatDateTimeLocal(dataBase));

      const fimDate = new Date(dataBase);
      fimDate.setHours(fimDate.getHours() + 1);
      setFim(formatDateTimeLocal(fimDate));

      setStatus("agendada");
      setValorPrevisto("");
      setObservacoes("");
      setModoVisualizacao(false);
      return;
    }

    // Evento existente: buscar os dados completos do evento no backend
    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/eventos/${dataSelecionada.id}`, { headers: getAuthHeaders() });
        if (!res.ok) {
          console.error('Erro ao buscar evento:', res.status);
          return;
        }

        const evt = await res.json();

        // Preencher campos básicos — prefira o nome do paciente quando disponível
        setPacienteInput((evt.paciente && evt.paciente.nome) || evt.descricao || "");
        setInicio(formatDateTimeLocal(evt.inicio));
        setFim(formatDateTimeLocal(evt.fim));
        setStatus(evt.status || "agendada");
        setValorPrevisto(evt.valorPrevisto || "");
        setObservacoes(evt.observacoes || "");
        setModoVisualizacao(true);

        // Paciente
        if (evt.paciente) {
          setPacienteSelecionado(evt.paciente);
        } else if (evt.pacienteId) {
          setPacienteSelecionado({ id: evt.pacienteId, nome: evt.descricao });
        }

        // Carregar lista de tratamentos do paciente (para popular select)
        if (evt.pacienteId) {
          try {
            const trRes = await fetch(`http://localhost:3001/tratamentos/${evt.pacienteId}`, { headers: getAuthHeaders() });
            if (trRes.ok) {
              const listaTrat = await trRes.json();
              setTratamentos(Array.isArray(listaTrat) ? listaTrat : []);
              // Se o evento já tem tratamentoId, selecionar
              if (evt.tratamentoId) {
                const foundTrat = listaTrat.find(t => t.id === parseInt(evt.tratamentoId));
                if (foundTrat) setTratamentoSelecionado(foundTrat);
              }
            }
          } catch (err) {
            setTratamentos([]);
          }
        }

        // Carregar procedimentos para o tratamento do evento
        if (evt.tratamentoId) {
          try {
            let procRes = await fetch(`http://localhost:3001/procedimentos/tratamento/${evt.tratamentoId}`, { headers: getAuthHeaders() });
            if (!procRes.ok) {
              procRes = await fetch(`http://localhost:3001/tratamentos/${evt.tratamentoId}/procedimentos`, { headers: getAuthHeaders() });
            }
            if (procRes.ok) {
              const listaProc = await procRes.json();
              setProcedimentos(Array.isArray(listaProc) ? listaProc : []);
              if (evt.procedimentoId) {
                const found = listaProc.find(p => p.id === parseInt(evt.procedimentoId));
                if (found) setProcedimentoSelecionado(found);
              }
            }
          } catch (err) {
            setProcedimentos([]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar evento:', err);
      }
    })();
  }, [isOpen, dataSelecionada]);

  // Quando o procedimento selecionado mudar, autocompletar o valor previsto
  useEffect(() => {
    if (procedimentoSelecionado) {
      try {
        const valor = procedimentoSelecionado.valor ?? procedimentoSelecionado.valorPrevisto ?? null;
        if (valor !== null && valor !== undefined) {
          setValorPrevisto(String(parseFloat(valor)));
        }
      } catch (e) {
        // ignore
      }
    }
  }, [procedimentoSelecionado]);

  // Buscar pacientes enquanto digita (autocompletar)
  useEffect(() => {
    if (pacienteInput.length > 0 && !modoVisualizacao) {
      const controller = new AbortController();
      fetch(`http://localhost:3001/pacientes?search=${encodeURIComponent(pacienteInput)}`, { headers: getAuthHeaders(), signal: controller.signal })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const filtrados = (data || [])
            .filter((p) => p.nome && p.nome.toLowerCase().includes(pacienteInput.toLowerCase()))
            .sort((a, b) => a.nome.localeCompare(b.nome));
          setPacientes(filtrados);
          setShowDropdown(filtrados.length > 0);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') console.error('Erro ao buscar pacientes:', err);
        });

      return () => controller.abort();
    } else {
      setShowDropdown(false);
      setPacientes([]);
    }
  }, [pacienteInput, modoVisualizacao]);

  // Quando selecionam um paciente (ou mudam para modo edição), carregar tratamentos desse paciente
  useEffect(() => {
    if (pacienteSelecionado && !modoVisualizacao) {
      fetch(`http://localhost:3001/tratamentos/${pacienteSelecionado.id}`, { headers: getAuthHeaders() })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          const lista = Array.isArray(data) ? data : [];
          setTratamentos(lista);
        })
        .catch((err) => {
          console.error('Erro ao buscar tratamentos:', err);
          setTratamentos([]);
        });
    } else {
      // limpa tratamentos e procedimentos ao não haver paciente selecionado ou em modo visualização
      setTratamentos([]);
      setTratamentoSelecionado(null);
      setProcedimentos([]);
      setProcedimentoSelecionado(null);
    }
  }, [pacienteSelecionado, modoVisualizacao]);

  useEffect(() => {
    if (tratamentoSelecionado && !modoVisualizacao) {
      const buscarProcedimentos = async () => {
        try {
          const res = await fetch(`http://localhost:3001/procedimentos/tratamento/${tratamentoSelecionado.id}`, {
            headers: getAuthHeaders()
          });

          if (res.ok) {
            const dataProc = await res.json();
            setProcedimentos(Array.isArray(dataProc) ? dataProc : []);
            return;
          }
        } catch (err) { }

        try {
          const res = await fetch(`http://localhost:3001/tratamentos/${tratamentoSelecionado.id}/procedimentos`, {
            headers: getAuthHeaders()
          });

          if (res.ok) {
            const dataProc = await res.json();
            setProcedimentos(Array.isArray(dataProc) ? dataProc : []);
            return;
          }
        } catch (err) { }

        setProcedimentos([]);
      };

      buscarProcedimentos();
    }
  }, [tratamentoSelecionado, modoVisualizacao]);

  const handleEdit = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setModoVisualizacao(false);
    setShowDropdown(false);
  };

  const handleSelectPaciente = (p) => {
    setPacienteSelecionado(p);
    setPacienteInput(p.nome);
    setTimeout(() => {
      setShowDropdown(false);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarHorarioExpediente(inicio, fim)) {
      addToast(`❌ Horário fora do expediente! Expediente: ${config.slotMinTime.slice(0, 5)} às ${config.slotMaxTime.slice(0, 5)}`, "error");
      return;
    }

    const statusCorrigido = status === "realizada" ? "concluída" : status;

    const eventoData = {
      descricao: pacienteInput,
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
      status: statusCorrigido,
      valorPrevisto: parseFloat(valorPrevisto) || 0,
      observacoes,
      pacienteId: pacienteSelecionado?.id || null,
      tratamentoId: tratamentoSelecionado?.id || null,
      procedimentoId: procedimentoSelecionado?.id || null,
    };

    console.log('Enviar evento - payload montado:', eventoData);

    try {
      const url = dataSelecionada?.id
        ? `http://localhost:3001/eventos/${dataSelecionada.id}`
        : "http://localhost:3001/eventos";
      const method = dataSelecionada?.id ? "PATCH" : "POST";

      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(eventoData) });

      console.log(`Resposta HTTP ${method} ${url} status:`, res.status);

      if (res.status === 409) {
        addToast("❌ Horário indisponível! Escolha outro horário.", "error");
        return;
      }

      if (!res.ok) throw new Error('Erro ao salvar evento');

      const saved = await res.json();
      console.log('Resposta do servidor após salvar evento:', saved);

      addToast("Agendamento salvo com sucesso!", "success");
      onSuccess();
      setModoVisualizacao(true);
      onClose();
    } catch (error) {
      addToast("Não foi possível salvar o agendamento.", "error");
    }
  };

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
      addToast("Não foi possível excluir o agendamento.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxHeight: '90vh', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <div className="modal-header">
            <h5 className="modal-title">Agendamento</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body" style={{ overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
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
              procedimentos={procedimentos}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              dataSelecionada={dataSelecionada}
              config={config}
            />
          </div>
        </div>
      </div>
    </div>
  );
}