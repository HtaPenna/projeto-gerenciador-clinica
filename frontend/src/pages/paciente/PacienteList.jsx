import React from "react";

export default function PacientesList({ pacientes, onEditar, onDeletar }) {
  if (!pacientes.length) return <p>Nenhum paciente cadastrado.</p>;

  return (
    <table border="1" cellPadding="5" cellSpacing="0">
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
              <button onClick={() => onDeletar(p.id)}>Ver Prontuário</button>{" "}
              <button onClick={() => onEditar(p)}>Editar</button>{" "}
              <button onClick={() => onDeletar(p.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
