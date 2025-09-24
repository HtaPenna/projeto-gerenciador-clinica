import Modal from "react-modal";

export default function ConfigCalendarModal({ isOpen, onRequestClose, config, setConfig }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Configurações do Calendário"
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
          zIndex: 9999,
        },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Configurações do Calendário</h2>

      <div className="mb-4 flex flex-col gap-2">
        <label>Início do expediente:</label>
        <input
          type="time"
          value={config.slotMinTime.slice(0, 5)}
          onChange={(e) =>
            setConfig({ ...config, slotMinTime: e.target.value + ":00" })
          }
          className="p-1 border rounded"
        />
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label>Fim do expediente:</label>
        <input
          type="time"
          value={config.slotMaxTime.slice(0, 5)}
          onChange={(e) =>
            setConfig({ ...config, slotMaxTime: e.target.value + ":00" })
          }
          className="p-1 border rounded"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 rounded"
        >
            Fechar
        </button>

        <button
            onClick={() => {
            // Aqui você poderia salvar no backend se quiser
            onRequestClose(); // Fecha o modal após salvar
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Salvar
        </button>
        </div>
    </Modal>
  );
}
