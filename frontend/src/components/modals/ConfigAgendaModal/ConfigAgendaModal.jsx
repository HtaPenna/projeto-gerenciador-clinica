export default function ConfigCalendarModal({ isOpen, onRequestClose, config, setConfig }) {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onRequestClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configurações do Calendário</h5>
            <button type="button" className="btn-close" onClick={onRequestClose}></button>
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
            <button type="button" className="btn btn-secondary" onClick={onRequestClose}>
              Fechar
            </button>
            <button type="button" className="btn btn-primary" onClick={onRequestClose}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}