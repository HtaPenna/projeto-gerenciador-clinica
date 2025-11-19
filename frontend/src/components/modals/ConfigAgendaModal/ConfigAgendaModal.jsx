export default function ConfigCalendarModal({ isOpen, onClose, config, setConfig, onSave }) {
  if (!isOpen) return null;

  const handleSalvar = () => {
    onSave(config);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configurações do Calendário</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Início do expediente:</label>
              <input
                type="time"
                className="form-control"
                value={config.slotMinTime.slice(0, 5)}
                onChange={(e) => setConfig({ ...config, slotMinTime: e.target.value + ":00" })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fim do expediente:</label>
              <input
                type="time"
                className="form-control"
                value={config.slotMaxTime.slice(0, 5)}
                onChange={(e) => setConfig({ ...config, slotMaxTime: e.target.value + ":00" })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSalvar}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}