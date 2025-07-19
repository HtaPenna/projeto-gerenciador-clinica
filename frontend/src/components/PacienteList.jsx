import React from "react";

export default function PacientesList({ pacientes, onEditar, onDeletar }) {
  if (!pacientes.length) return <p>Nenhum paciente cadastrado.</p>;

  return (
    <table border="1" cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map(p => (
          <tr key={p.Codigo_Pac}>
            <td>{p.Codigo_Pac}</td>
            <td>{p.Nome_Pac}</td>
            <td>{p.Tel_Pac}</td>
            <td>
              <button onClick={() => onEditar(p)}>Editar</button>{" "}
              <button onClick={() => onDeletar(p.Codigo_Pac)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
