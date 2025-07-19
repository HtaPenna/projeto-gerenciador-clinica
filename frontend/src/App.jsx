import React, { useState, useEffect } from "react";
import PacientesList from "./components/PacienteList.jsx";
import PacienteForm from "./components/PacienteForm.jsx";

const API_URL = "http://localhost:3001/pacientes";

export default function App() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteEditando, setPacienteEditando] = useState(null);

  // Carrega pacientes (GET)
  const carregarPacientes = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPacientes(data))
      .catch(console.error);
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Criar paciente (POST)
  const criarPaciente = (paciente) => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente)
    })
      .then(() => {
        carregarPacientes();
      })
      .catch(console.error);
  };

  // Atualizar paciente (PUT)
  const atualizarPaciente = (id, paciente) => {
    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente)
    })
      .then(() => {
        setPacienteEditando(null);
        carregarPacientes();
      })
      .catch(console.error);
  };

  // Deletar paciente (DELETE)
  const deletarPaciente = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
      .then(() => carregarPacientes())
      .catch(console.error);
  };

  return (
    <div>
      <h1>Gerenciamento de Pacientes</h1>

      <PacienteForm
        paciente={pacienteEditando}
        onSalvar={(paciente) => {
          if (paciente.Codigo_Pac) {
            atualizarPaciente(paciente.Codigo_Pac, paciente);
          } else {
            criarPaciente(paciente);
          }
        }}
        onCancelar={() => setPacienteEditando(null)}
      />

      <PacientesList
        pacientes={pacientes}
        onEditar={(paciente) => setPacienteEditando(paciente)}
        onDeletar={deletarPaciente}
      />
    </div>
  );
}
