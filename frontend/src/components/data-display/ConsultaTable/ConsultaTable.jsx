// ConsultaTable.jsx - Versão Cards/Listas
import React from 'react';
import './ConsultaTable.css';

export default function ConsultaTable({ 
  consultas, 
  tipo,
  onAbrirDescricao,
  onVerProntuario,
  onAtualizarStatus 
}) {
  const tipoClasse = tipo === 'concluída' ? 'concluida' : 'outras';

  const formatarDataHora = (dataString) => {
    const data = new Date(dataString);
    return {
      data: data.toLocaleDateString('pt-BR'),
      hora: data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Função para obter a classe do status
  const getStatusClass = (status) => {
    switch(status) {
      case 'agendada': return 'status-agendada';
      case 'confirmada': return 'status-confirmada';
      case 'concluída': return 'status-concluida';
      default: return '';
    }
  };

  return (
    <div className={`consultaTableContainer ${tipoClasse}`}>
      <h2 className={`consultaTableHeader ${tipoClasse}`}>
        {tipo === 'concluída' ? 'Consultas Concluídas' : 'Outras Consultas'} ({consultas.length})
      </h2>

      {consultas.length > 0 ? (
        <div className="consultasList">
          {consultas.map((consulta) => {
            const { data, hora } = formatarDataHora(consulta.inicio);
            const statusClass = getStatusClass(consulta.status);
            
            return (
              <div key={consulta.id} className="consultaCard">
                {/* Coluna Data/Hora */}
                <div className="colDataHora">
                  <div className="dataHora">{hora}</div>
                  <div className="data">{data}</div>
                </div>

                {/* Coluna Informações do Paciente */}
                <div className="colPaciente">
                  <div className="nomePaciente">
                    {consulta.paciente?.nome || "—"}
                  </div>
                  <div className="infoProcedimento">
                    <div className="tratamento">
                      {consulta.tratamento?.nome || "—"} 
                    </div>
                    <div className="procedimento">
                      {consulta.procedimento?.nome || "—"}
                    </div>
                  </div>
                </div>

                {/* Coluna Status */}
                <div className="colStatus">
                  <select
                    value={consulta.status}
                    onChange={(e) => onAtualizarStatus(consulta.id, e.target.value)}
                    className={`selectStatus ${statusClass}`}
                  >
                    <option value="agendada">Status: Agendada</option>
                    <option value="confirmada">Status: Confirmada</option>
                    <option value="concluída">Status: Concluída</option>
                  </select>
                </div>

                {/* Coluna Ações */}
                <div className="colAcoes">
                  <div className="acoesContainer">
                    <button
                      onClick={() => onAbrirDescricao(consulta)}
                      className="btnAbrirDescricao"
                    >
                      Abrir descrição
                    </button>
                    <button
                      onClick={() => onVerProntuario(consulta.pacienteId)}
                      className="btnVerProntuario"
                    >
                      Ver prontuário
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="semConsultas">
          {tipo === 'concluída' 
            ? 'Nenhuma consulta concluída encontrada.' 
            : 'Nenhuma consulta encontrada.'
          }
        </div>
      )}
    </div>
  );
}