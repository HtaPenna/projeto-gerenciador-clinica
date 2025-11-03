import React from "react";
import './PacienteList.css';

export default function PacientesList({ pacientes, onEditar, onDeletar, onVerProntuario }) {
  if (!pacientes.length) return <p>Nenhum paciente cadastrado.</p>;

  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>{p.telefoneCelular}</td>
              <td>
                <button onClick={() => onVerProntuario(p.id)}>Ver Prontuário</button>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
