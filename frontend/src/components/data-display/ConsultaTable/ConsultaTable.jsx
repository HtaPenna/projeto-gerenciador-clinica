import React from 'react';

export default function ConsultaTable({ 
  consultas, 
  tipo,
  onAbrirDescricao,
  onVerProntuario,
  onAtualizarStatus 
}) {
  const cores = {
    concluída: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      header: 'bg-green-100',
      hover: 'hover:bg-green-50',
      button: 'bg-green-600 hover:bg-green-700'
    },
    outras: {
      bg: 'bg-yellow-50', 
      border: 'border-yellow-300',
      header: 'bg-yellow-100',
      hover: 'hover:bg-yellow-50',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    }
  };

  const cor = cores[tipo] || cores.outras;

  return (
    <div className={`${cor.bg} ${cor.border} rounded-lg shadow-md p-4 mb-6`}>
      <h2 className={`text-lg font-semibold ${tipo === 'concluída' ? 'text-green-700' : 'text-yellow-700'} mb-3`}>
        {tipo === 'concluída' ? 'Consultas Concluídas' : 'Outras Consultas'} ({consultas.length})
      </h2>

      {consultas.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className={`${cor.header} text-left`}>
              <th className="p-2 border">Paciente</th>
              <th className="p-2 border">Tratamento</th>
              <th className="p-2 border">Procedimento</th>
              <th className="p-2 border">Data / Hora</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((consulta) => (
              <tr key={consulta.id} className={cor.hover}>
                <td className="p-2 border">{consulta.paciente?.nome || "—"}</td>
                <td className="p-2 border">{consulta.tratamento?.nome || "—"}</td>
                <td className="p-2 border">{consulta.procedimento?.nome || "—"}</td>
                <td className="p-2 border">
                  {new Date(consulta.inicio).toLocaleString("pt-BR")}
                </td>
                <td className="p-2 border">
                  <select
                    value={consulta.status}
                    onChange={(e) => onAtualizarStatus(consulta.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="concluída">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </td>
                <td className="p-2 border text-center flex gap-2 justify-center">
                  <button
                    onClick={() => onAbrirDescricao(consulta)}
                    className={`px-3 py-1 ${cor.button} text-white rounded`}
                  >
                    Abrir descrição
                  </button>
                  <button
                    onClick={() => onVerProntuario(consulta.pacienteId)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Ver prontuário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-sm">
          {tipo === 'concluída' 
            ? 'Nenhuma consulta concluída encontrada.' 
            : 'Nenhuma consulta encontrada.'
          }
        </p>
      )}
    </div>
  );
}