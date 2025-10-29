import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PacientesList from "./PacienteList.jsx";
import PacienteForm from "./PacienteForm.jsx";
import AnamneseForm from "./AnamneseForm.jsx";
import "./Paciente.css";

const API_URL = "http://localhost:3001/pacientes";

export default function Paciente() {
  const navigate = useNavigate(); 
  const [pacientes, setPacientes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pacienteCriando, setPacienteCriando] = useState(null);
  const [anamneseCriando, setAnamneseCriando] = useState(null);

  // Carrega pacientes
  const carregarPacientes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Criar paciente
  const criarPaciente = async (paciente) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      const novoPaciente = await res.json();
      carregarPacientes();
      setPacienteCriando(novoPaciente);
      // Sempre criar anamnese associada
      setAnamneseCriando({ pacienteId: novoPaciente.id });
    } catch (err) {
      console.error(err);
    }
  };

  // Formulários de criação
  if (mostrarForm || pacienteCriando) {
    return (
      <div className="paciente-container">
        <h1>Novo Paciente</h1>

        {/* Formulário de Dados Pessoais */}
        <PacienteForm
          paciente={pacienteCriando}
          onSalvar={(paciente) => {
            if (!paciente.id) {
              criarPaciente(paciente);
              alert("Paciente criado com sucesso! Agora você pode preencher a anamnese.");
            }
          }}
          onCancelar={() => {
            setPacienteCriando(null);
            setAnamneseCriando(null);
            setMostrarForm(false);
          }}
        />

        {/* Formulário de Anamnese */}
        {anamneseCriando && anamneseCriando.pacienteId && (
          <AnamneseForm
            anamnese={anamneseCriando}
            onSalvar={async (anamnese) => {
              try {
                const method = anamnese.id ? "PATCH" : "POST";
                const url = anamnese.id
                    ? `http://localhost:3001/anamnese/${anamnese.id}`
                    : "http://localhost:3001/anamnese";
                await fetch(url, {
                  method,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(anamnese),
                });
                alert("Anamnese salva com sucesso!");
                setAnamneseCriando(null);
                setPacienteCriando(null);
                setMostrarForm(false);
              } catch (err) {
                console.error(err);
              }
            }}
            onCancelar={() => setAnamneseCriando(null)}
          />
        )}
      </div>
    );
  }

  // Página principal com lista de pacientes e botão de criar
  return (
    <div>
      <h1>Pacientes</h1>
      <button
        onClick={() => {
          setPacienteCriando({});
          setMostrarForm(true);
          setAnamneseCriando({}); // criar nova anamnese
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Novo Paciente
      </button>

      <PacientesList
        pacientes={pacientes}
        onVerProntuario={(id) => navigate(`/main/pacientes/${id}/prontuario`)}
      />
    </div>
  );
}
