import React, { useState, useEffect } from "react";
import { useAuth } from '../../../hooks/useAuth';

const API_URL = "http://localhost:3001/eventos";

export default function ConsultasHojeHome() {
  const [consultasHoje, setConsultasHoje] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    const carregarConsultasHoje = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL, { headers: getAuthHeaders() });
        const data = await res.json();
        
        const hoje = new Date();
        const hojeFormatado = hoje.toISOString().split('T')[0];
        
        const consultasDoDia = data.filter((evento) => {
          if (evento.status === "indisponível") return false;
          
          const dataEvento = new Date(evento.inicio);
          const dataEventoFormatada = dataEvento.toISOString().split('T')[0];
          
          return dataEventoFormatada === hojeFormatado;
        });

        setConsultasHoje(consultasDoDia);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarConsultasHoje();
  }, []);

  const formatarHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="carregando-consultas">Carregando consultas de hoje...</div>;
  }

  return (
    <div className="consultas-hoje-home">
      <h3>Consultas de Hoje ({consultasHoje.length})</h3>
      
      {consultasHoje.length > 0 ? (
        <div className="lista-consultas-hoje">
          {consultasHoje.map((consulta) => (
            <div key={consulta.id} className="consulta-item-hoje">
              <div className="consulta-info-principal">
                <strong>{consulta.paciente?.nome || "—"}</strong>
                <span className="consulta-hora">{formatarHora(consulta.inicio)}</span>
              </div>
              <div className="consulta-detalhes">
                <span className={`status-badge status-${consulta.status}`}>
                  {consulta.status}
                </span>
                <span>{consulta.tratamento?.nome || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sem-consultas-hoje">Nenhuma consulta agendada para hoje.</p>
      )}
    </div>
  );
}