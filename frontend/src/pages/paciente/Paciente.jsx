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
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [anamneseEditando, setAnamneseEditando] = useState(null);

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
      setPacienteEditando(novoPaciente);
      // Sempre criar anamnese associada ao paciente
      setAnamneseEditando({ pacienteId: novoPaciente.id });
    } catch (err) {
      console.error(err);
    }
  };

  // Atualizar paciente
  const atualizarPaciente = async (id, paciente) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      setPacienteEditando({ ...pacienteEditando, ...paciente });
      carregarPacientes();
    } catch (err) {
      console.error(err);
    }
  };

  // Deletar paciente
  const deletarPaciente = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      carregarPacientes();
    } catch (err) {
      console.error(err);
    }
  };

  // Carregar anamnese existente ou criar nova
  const carregarAnamnese = async (pacienteId) => {
    try {
      const res = await fetch(`http://localhost:3001/anamnese/paciente/${pacienteId}`);
      if (res.status === 404) {
        setAnamneseEditando({ pacienteId }); // nova anamnese
      } else {
        const data = await res.json();
        setAnamneseEditando(data); // preencher com dados existentes
      }
    } catch (err) {
      console.error(err);
      setAnamneseEditando({ pacienteId });
    }
  };

  // Página de criação/edição com ambos os forms
  if (mostrarForm || pacienteEditando) {
    return (
      <div className="paciente-container">
        <h1>{pacienteEditando ? "Editar Paciente" : "Novo Paciente"}</h1>
          {/* Formulário de Dados Pessoais */}
          <PacienteForm
            paciente={pacienteEditando}
            onSalvar={(paciente) => {
              if (paciente.id) {
                atualizarPaciente(paciente.id, paciente);
                alert("Paciente atualizado com sucesso!");
              } else {
                criarPaciente(paciente);
                alert("Paciente criado com sucesso! Agora você pode preencher a anamnese.");
              }
            }}
            onCancelar={() => {
              setPacienteEditando(null);
              setMostrarForm(false);
              setAnamneseEditando(null);
            }}
          />

          {/* Formulário de Anamnese */}
          {anamneseEditando && anamneseEditando.pacienteId && (
            <AnamneseForm
              anamnese={anamneseEditando}
              onSalvar={async (anamnese) => {
                try {
                  const method = anamnese.id ? "PATCH" : "POST";
                  const url = anamnese.id
                      ? `http://localhost:3001/anamnese/${anamnese.id}` // atualiza pela id da anamnese
                      : "http://localhost:3001/anamnese";
                  await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(anamnese),
                  });
                  alert("Anamnese salva com sucesso!");
                  setAnamneseEditando(null);
                  setPacienteEditando(null);
                  setMostrarForm(false);
                } catch (err) {
                  console.error(err);
                }
              }}
              onCancelar={() => setAnamneseEditando(null)}
            />
          )}
      </div>
    );
  }

  // Página principal com lista de pacientes
  return (
    <div>
      <h1>Pacientes</h1>
      <button
        onClick={() => {
          setPacienteEditando(null);
          setMostrarForm(true);
          setAnamneseEditando({}); // criar nova anamnese
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
          carregarAnamnese(paciente.id); // carrega anamnese existente ou cria nova
        }}
        onDeletar={deletarPaciente}
        onVerProntuario={(id) => navigate(`/main/pacientes/${id}/prontuario`)}
      />
    </div>
  );
}
