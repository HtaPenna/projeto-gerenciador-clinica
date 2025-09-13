import { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function NovoEventoModal({
  isOpen,
  onRequestClose,
  dataSelecionada,
  onSuccess,
  pacienteId,
  dentistaId
}) {
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState(formatDateTimeLocal(dataSelecionada || new Date()));
  const [fim, setFim] = useState(formatDateTimeLocal(new Date((dataSelecionada || new Date()).getTime() + 60 * 60 * 1000)));
  const [status, setStatus] = useState("pendente");
  const [observacoes, setObservacoes] = useState("");

  const [pacientes, setPacientes] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [tratamentos, setTratamentos] = useState([]);

  const [pacienteSelecionado, setPacienteSelecionado] = useState(pacienteId || "");
  const [procedimentosSelecionados, setProcedimentosSelecionados] = useState([]);
  const [tratamentoSelecionado, setTratamentoSelecionado] = useState("");

  useEffect(() => {
    // Carregar pacientes, procedimentos e tratamentos
    fetch("http://localhost:3001/pacientes")
      .then(res => res.json())
      .then(data => setPacientes(data));

    fetch("http://localhost:3001/procedimentos")
      .then(res => res.json())
      .then(data => setProcedimentos(data));

    fetch("http://localhost:3001/tratamentos")
      .then(res => res.json())
      .then(data => setTratamentos(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoEvento = {
      titulo,
      inicio: new Date(inicio).toISOString(),
      fim: new Date(fim).toISOString(),
      pacienteId: pacienteSelecionado,
      dentistaId,
      status,
      observacoes,
      procedimentosIds: procedimentosSelecionados,
      tratamentoId: tratamentoSelecionado || null,
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

  function formatDateTimeLocal(date) {
    const pad = (n) => n.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

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
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          color: '#1a202c',
        },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }
      }}
    >
      <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={pacienteSelecionado}
          onChange={(e) => setPacienteSelecionado(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Selecione o paciente</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.Nome_Pac}</option>
          ))}
        </select>

        <div>
          <label className="block mb-1 font-medium">Início</label>
          <input
            type="datetime-local"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Fim</label>
          <input
            type="datetime-local"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="pendente">Pendente</option>
          <option value="confirmada">Confirmada</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
          <option value="bloqueado">Bloqueado</option>
        </select>

        <label className="block font-medium">Procedimentos</label>
        <select
          multiple
          value={procedimentosSelecionados}
          onChange={(e) => setProcedimentosSelecionados([...e.target.selectedOptions].map(opt => opt.value))}
          className="w-full p-2 border rounded"
        >
          {procedimentos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <label className="block font-medium">Tratamento (opcional)</label>
        <select
          value={tratamentoSelecionado}
          onChange={(e) => setTratamentoSelecionado(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Nenhum</option>
          {tratamentos.map(t => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>

        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onRequestClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
