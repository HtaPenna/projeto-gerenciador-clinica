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
    <div className="space-y-3">
      <div>
        <label className="block font-semibold mb-1">Diagnóstico:</label>
        <textarea
          value={diagnostico}
          onChange={(e) => onDiagnosticoChange(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Tratamento Realizado:</label>
        <textarea
          value={tratamentoRealizado}
          onChange={(e) => onTratamentoChange(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Procedimento Realizado:</label>
        <textarea
          value={procedimentoRealizado}
          onChange={(e) => onProcedimentoChange(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Observações Clínicas:</label>
        <textarea
          value={observacoesClinicas}
          onChange={(e) => onObservacoesChange(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Recomendações Pós-Atendimento:
        </label>
        <textarea
          value={recomendacoes}
          onChange={(e) => onRecomendacoesChange(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Anexos (opcional):</label>
        <input
          type="file"
          multiple
          onChange={onAnexosChange}
          className="block w-full border p-2 rounded"
        />
        {anexos.length > 0 && (
          <ul className="text-sm text-gray-600 mt-2 list-disc pl-5">
            {anexos.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}