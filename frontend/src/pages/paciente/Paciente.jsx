// src/pages/paciente/Paciente.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PacientesList from "./PacienteList.jsx";
import PacienteForm from "./PacienteForm.jsx";
import AnamneseForm from "./AnamneseForm.jsx";
import { usePageTitle } from '../../hooks/usePageTitle';
import "./Paciente.css";

const API_URL = "http://localhost:3001/pacientes";

export default function Paciente() {
  const navigate = useNavigate();
  const { updateTitle } = usePageTitle();
  const { id } = useParams(); // pega o id da rota
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pacienteCriando, setPacienteCriando] = useState(null);
  const [anamneseCriando, setAnamneseCriando] = useState(null);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    updateTitle('Pacientes');
  }, [updateTitle]);

  // Detecta se é criação de novo paciente
  useEffect(() => {
    if (id === "novo") {
      setPacienteCriando({});
      setAnamneseCriando({});
      setMostrarForm(true);
    } else if (id) {
      // Caso queira edição, carregar dados do paciente aqui
      fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(data => {
          setPacienteCriando(data);
          setAnamneseCriando({ pacienteId: data.id });
          setMostrarForm(true);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // Carrega pacientes
  const carregarPacientes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPacientes(data);
      setPacientesFiltrados(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  // Função de busca automática
  useEffect(() => {
    if (!busca.trim()) {
      setPacientesFiltrados(pacientes);
      return;
    }
    const filtrados = pacientes.filter(p =>
      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.telefoneCelular?.includes(busca)
    );
    setPacientesFiltrados(filtrados);
  }, [busca, pacientes]);

  // Criar paciente
  const criarPaciente = async (paciente) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      const novoPaciente = await res.json();
      if (res.ok) {
        await carregarPacientes();
        setPacienteCriando(novoPaciente);
        setAnamneseCriando({ pacienteId: novoPaciente.id });
      } else {
        alert("Erro ao criar paciente: " + (novoPaciente.erro || novoPaciente.message));
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão ao criar paciente");
    }
  };

  // Formulários de criação/edição
  if (mostrarForm && pacienteCriando) {
    return (
      <div className="paciente-container">
        <h1>{id === "novo" ? "Novo Paciente" : "Editar Paciente"}</h1>

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
            navigate("/main/pacientes");
          }}
        />

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
                navigate("/main/pacientes");
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

  // Página principal com lista de pacientes
  return (
    <div className="pacienteContainer">
      <div className="searchBar">
        <input 
          type="text" 
          placeholder="Procurar paciente por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <PacientesList
        pacientes={pacientesFiltrados}
        onVerProntuario={(id) => navigate(`/main/pacientes/${id}/prontuario`)}
      />
    </div>
  );
}
