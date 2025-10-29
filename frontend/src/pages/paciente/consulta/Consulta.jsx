import React, { useState, useEffect } from "react";

const API_EVENTOS = "http://localhost:3001/eventos";

export default function Consultas({ pacienteId }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarConsultas = async () => {
    if (!pacienteId) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_EVENTOS}/paciente/${pacienteId}`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setConsultas(data);
    } catch (err) {
      console.error("Erro ao carregar consultas:", err);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, [pacienteId]);

  if (loading) return <p>Carregando consultas...</p>;

  if (consultas.length === 0) return <p>Não há consultas cadastradas para este paciente.</p>;

  return (
    <div>
      <h2>Histórico de Consultas</h2>
      <table className="tabela-consultas">
        <thead>
          <tr>
            <th>Horário</th>
            <th>Tratamento</th>
            <th>Procedimento</th>
            <th>Status</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {consultas.map((c) => {
            const inicio = new Date(c.inicio).toLocaleString();
            return (
              <tr key={c.id}>
                <td>{inicio}</td>
                <td>{c.tratamento?.nome || "—"}</td>
                <td>{c.procedimento?.nome || "—"}</td>
                <td>{c.status}</td>
                <td>{c.observacoes || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
