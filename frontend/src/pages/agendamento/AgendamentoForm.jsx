import { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // obrigatório para acessibilidade

export default function NovoEventoModal({ isOpen, onRequestClose, dataSelecionada, onSuccess, pacienteId }) {
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState(formatDateTimeLocal(dataSelecionada || new Date()));
  const [fim, setFim] = useState(formatDateTimeLocal(new Date((dataSelecionada || new Date()).getTime() + 60 * 60 * 1000)));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoEvento = {
      title: titulo,
      start: new Date(inicio).toISOString(),
      end: new Date(fim).toISOString(),
      pacienteId: pacienteId || null,
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
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 50,
        },
        }}
    >
        <h2 className="text-xl font-bold mb-4">Novo Evento</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="text"
            placeholder="Título do evento"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full p-2 border rounded"
        />

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

        <div className="flex justify-end gap-2">
            <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 rounded"
            >
            Cancelar
            </button>
            <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            >
            Salvar
            </button>
        </div>
        </form>
    </Modal>
    );
}