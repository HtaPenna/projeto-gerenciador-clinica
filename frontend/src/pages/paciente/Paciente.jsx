import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PacientesList from "./PacienteList.jsx";
import PacienteForm from "./PacienteForm.jsx";
import AnamneseForm from "./AnamneseForm.jsx";
import { usePageTitle } from '../../hooks/usePageTitle';
import { Plus, User, Calendar, Package } from "lucide-react";
import "./Paciente.css";

const API_URL = "http://localhost:3001/pacientes";

export default function Paciente() {
  const navigate = useNavigate();
  const { updateTitle } = usePageTitle();
  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pacienteCriando, setPacienteCriando] = useState(null);
  const [anamneseCriando, setAnamneseCriando] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
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

    // Função de busca automática
  const filtrarPacientes = (termo) => {
    if (!termo.trim()) {
      setPacientesFiltrados(pacientes);
      return;
    }
    
    const filtrados = pacientes.filter(paciente =>
      paciente.nome?.toLowerCase().includes(termo.toLowerCase()) ||
      paciente.telefoneCelular?.includes(termo)
    );
    
    setPacientesFiltrados(filtrados);
  };

  // Busca automática quando digitar
  useEffect(() => {
    filtrarPacientes(busca);
  }, [busca, pacientes]);

  // Carrega pacientes
  const carregarPacientes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPacientes(data);
      setPacientesFiltrados(data); // Inicializa com todos os pacientes
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
      console.log("Dados enviados para criar paciente:", paciente);
      
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      
      console.log("Status da resposta:", res.status);
      
      const novoPaciente = await res.json();
      console.log("Paciente criado:", novoPaciente);
      
      if (res.ok) {
        await carregarPacientes();
        setPacienteCriando(novoPaciente);
        setAnamneseCriando({ pacienteId: novoPaciente.id });
        
        console.log("🔍 Estados APÓS atualização:");
        console.log(" - pacienteCriando:", novoPaciente);
        console.log(" - anamneseCriando:", { pacienteId: novoPaciente.id });
      } else {
        console.error("Erro na criação:", novoPaciente);
        alert("Erro ao criar paciente: " + (novoPaciente.erro || novoPaciente.message));
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      alert("Erro de conexão ao criar paciente");
    }
  };

  // Função para novo paciente
  const handleNovoPaciente = () => {
    setPacienteCriando({});
    setMostrarForm(true);
    setAnamneseCriando({});
    setDropdownOpen(false);
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
    <div className="pacienteContainer">
      <div className="fab-container" ref={dropdownRef}>
        <button 
          className="btnNew" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Plus size={30}/>
        </button>

        {dropdownOpen && (
          <div className="newDropContainer">
            <button onClick={handleNovoPaciente} className="dropdown-option">
              <User size={16} />
              <span>Novo paciente</span>
            </button>
            <button className="dropdown-option">
              <Calendar size={16} />
              <span>Nova consulta</span>
            </button>
            <button className="dropdown-option">
              <Package size={16} />
              <span>Novo relatorio</span>
            </button>
          </div>
        )}
      </div>

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