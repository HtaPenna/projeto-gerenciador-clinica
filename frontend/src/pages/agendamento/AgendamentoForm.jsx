import { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function NovoEventoModal({ isOpen, onRequestClose, dataSelecionada, onSuccess, dentistaId }) {
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState(formatDateTimeLocal(dataSelecionada || new Date()));
  const [fim, setFim] = useState(formatDateTimeLocal(new Date((dataSelecionada || new Date()).getTime() + 60 * 60 * 1000)));
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

  // Atualiza título automaticamente
  useEffect(() => {
    if (status === "indisponível") setTitulo("Indisponível");
    else if (pacienteSelecionado) setTitulo(pacienteSelecionado.nome);
    else setTitulo("");
  }, [status, pacienteSelecionado]);

  // Buscar pacientes conforme digitação
  useEffect(() => {
    if (pacienteInput.length > 0 && status !== "indisponível") {
      fetch(`http://localhost:3001/pacientes?search=${pacienteInput}`)
        .then(res => res.json())
        .then(data => {
          const filtrados = data
            .filter(p => p.nome.toLowerCase().includes(pacienteInput.toLowerCase()))
            .sort((a, b) => a.nome.localeCompare(b.nome));
          setPacientes(filtrados);
          setShowDropdown(true);
        })
        .catch(err => console.error(err));
    } else {
      setPacientes([]);
      setShowDropdown(false);
      setPacienteSelecionado(null);
      setTratamentos([]);
      setTratamentoSelecionado(null);
      setProcedimentoSelecionado(null);
    }
  }, [pacienteInput, status]);

  // Buscar tratamentos do paciente selecionado
  useEffect(() => {
    if (pacienteSelecionado) {
      fetch(`http://localhost:3001/tratamentos/${pacienteSelecionado.id}`)
        .then(res => res.json())
        .then(async dataTrat => {
          const tratamentosComProcedimentos = await Promise.all(
            dataTrat.map(async (trat) => {
              const resProc = await fetch(`http://localhost:3001/procedimentos/tratamento/${trat.id}`);
              const procedimentos = resProc.ok ? await resProc.json() : [];
              return { ...trat, procedimentos };
            })
          );
          setTratamentos(tratamentosComProcedimentos);
        })
        .catch(err => console.error(err));
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
    setTratamentoSelecionado(null);
    setProcedimentoSelecionado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "indisponível" && !pacienteSelecionado) {
      alert("Selecione um paciente válido!");
      return;
    }

    const novoEvento = {
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
      await fetch("http://localhost:3001/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEvento),
      });
      onSuccess();
      onRequestClose();
    } catch (error) {
      alert("Erro ao salvar evento");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Novo Evento"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          color: '#1a202c',
        },
        overlay: { backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50 },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Paciente */}
        {status !== "indisponível" && (
          <div className="relative">
            <label className="block mb-1 font-medium">Paciente</label>
            <input
              type="text"
              placeholder="Digite o nome do paciente"
              value={pacienteInput}
              onChange={(e) => { setPacienteInput(e.target.value); setPacienteSelecionado(null); setShowDropdown(true); }}
              onFocus={() => pacienteInput && setShowDropdown(true)}
              required
              className="w-full p-2 border rounded"
            />
            {showDropdown && pacientes.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border mt-1 max-h-40 overflow-auto rounded shadow">
                {pacientes.map(p => (
                  <li
                    key={p.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={(e) => { e.preventDefault(); handleSelectPaciente(p); }}
                  >
                    {p.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tratamento */}
        {pacienteSelecionado && tratamentos.length > 0 && (
          <div>
            <label className="block mb-1 font-medium">Tratamento</label>
            <select
              value={tratamentoSelecionado?.id || ""}
              onChange={(e) => {
                const sel = tratamentos.find(t => t.id === parseInt(e.target.value));
                setTratamentoSelecionado(sel || null);
                setProcedimentoSelecionado(null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione um tratamento</option>
              {tratamentos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
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
                const sel = tratamentoSelecionado.procedimentos.find(p => p.id === parseInt(e.target.value));
                setProcedimentoSelecionado(sel || null);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione um procedimento</option>
              {tratamentoSelecionado.procedimentos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
        )}

        {/* Início e Fim */}
        <div>
          <label className="block mb-1 font-medium">Início</label>
          <input type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input type="datetime-local" value={fim} onChange={(e) => setFim(e.target.value)} required className="w-full p-2 border rounded" />
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
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}

function formatDateTimeLocal(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
