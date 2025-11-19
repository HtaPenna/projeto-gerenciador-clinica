import React from 'react';

export default function ConsultaForm({
  diagnostico,
  onDiagnosticoChange,
  tratamentoRealizado,
  onTratamentoChange,
  procedimentoRealizado,
  onProcedimentoChange,
  observacoesClinicas,
  onObservacoesChange,
  recomendacoes,
  onRecomendacoesChange,
  anexos,
  onAnexosChange
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Diagnóstico:</label>
            <textarea
              value={diagnostico}
              onChange={(e) => onDiagnosticoChange(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Tratamento Realizado:</label>
            <textarea
              value={tratamentoRealizado}
              onChange={(e) => onTratamentoChange(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Procedimento Realizado:</label>
            <textarea
              value={procedimentoRealizado}
              onChange={(e) => onProcedimentoChange(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Observações Clínicas:</label>
            <textarea
              value={observacoesClinicas}
              onChange={(e) => onObservacoesChange(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Recomendações Pós-Atendimento:</label>
            <textarea
              value={recomendacoes}
              onChange={(e) => onRecomendacoesChange(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Anexos (opcional):</label>
            <input
              type="file"
              multiple
              onChange={onAnexosChange}
              className="form-control"
            />
            {anexos.length > 0 && (
              <ul className="text-muted mt-2 list-unstyled">
                {anexos.map((file, idx) => (
                  <li key={idx} className="small">
                    📎 {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}