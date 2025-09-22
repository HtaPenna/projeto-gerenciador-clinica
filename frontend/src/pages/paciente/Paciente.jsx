import React, { useState, useEffect } from "react";
import PacientesList from "./PacienteList.jsx";
import PacienteForm from "./PacienteForm.jsx";
import "./Paciente.css";

const API_URL = "http://localhost:3001/pacientes";

export default function Paciente() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  // Carrega pacientes (GET)
  const carregarPacientes = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPacientes(data))
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
      body: JSON.stringify(paciente),
    })
      .then(() => {
        carregarPacientes();
        setMostrarForm(false); // fecha o form
      })
      .catch(console.error);
  };

  // Atualizar paciente (PATCH)
  const atualizarPaciente = (id, paciente) => {
    fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paciente),
    })
      .then(() => {
        setPacienteEditando(null);
        carregarPacientes();
        setMostrarForm(false); // fecha o form
      })
      .catch(console.error);
  };

  // Deletar paciente (DELETE)
  const deletarPaciente = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => carregarPacientes())
      .catch(console.error);
  };

  // Se estiver mostrando o form, renderiza só ele
  if (mostrarForm || pacienteEditando) {
    return (
      <div>
        <h1>{pacienteEditando ? "Editar Paciente" : "Novo Paciente"}</h1>
        <PacienteForm
          paciente={pacienteEditando}
          onSalvar={(paciente) => {
            if (paciente.id) {
              atualizarPaciente(paciente.id, paciente);
            } else {
              criarPaciente(paciente);
            }
          }}
          onCancelar={() => {
            setPacienteEditando(null);
            setMostrarForm(false);
          }}
        />
      </div>
    );
  }

  // Caso contrário, mostra só a lista com botão "Novo"
  return (
    <div>
      <h1>Pacientes</h1>
      <button
        onClick={() => {
          setPacienteEditando(null);
          setMostrarForm(true);
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Novo Paciente
      </button>

      <PacientesList
        pacientes={pacientes}
        onEditar={(paciente) => {
          setPacienteEditando(paciente);
          setMostrarForm(true);
        }}
        onDeletar={deletarPaciente}
      />
    </div>
  );
}
