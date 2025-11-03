import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import VisaoGeral from "./visaoGeral/VisaoGeral.jsx";
import Anamnese from "./anamnese/Anamnese.jsx";
import Consultas from "./consulta/Consulta.jsx";
import Tratamentos from "./tratamento/Tratamento.jsx";

const API_PACIENTES = "http://localhost:3001/pacientes";

export default function Prontuario() {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [secaoAtiva, setSecaoAtiva] = useState("tratamentos"); // seção padrão

  // Carregar dados do paciente
  const carregarPaciente = async () => {
    try {
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`);
      if (res.status === 404) {
        alert("Paciente não encontrado");
        navigate("/pacientes");
        return;
      }
      const data = await res.json();
      setPaciente(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPaciente();
  }, [pacienteId]);

  // Função para excluir paciente
  const excluirPaciente = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
      await fetch(`${API_PACIENTES}/${pacienteId}`, { method: "DELETE" });
      alert("Paciente excluído com sucesso!");
      navigate("/main/pacientes");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir paciente");
    }
  };

  if (!paciente) return <p>Carregando paciente...</p>;

  return (
    <div className="prontuario-container">
      <button
        onClick={() => navigate("/main/pacientes")}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Voltar
      </button>
      
      <h3>Prontuário</h3>

      {/* Card superior com dados pessoais */}
      <div className="card-paciente p-4 bg-white shadow rounded mb-4">
        <h1>{paciente.nome}</h1>
        <p><strong>Telefone:</strong> {paciente.telefoneCelular}</p>
        {paciente.email && <p><strong>Email:</strong> {paciente.email}</p>}
        {paciente.dataNascimento && <p><strong>Data de Nascimento:</strong> {paciente.dataNascimento}</p>}
        {paciente.cpf && <p><strong>CPF:</strong> {paciente.cpf}</p>}
      </div>

      {/* Menu interno de seções */}
      <div className="menu-secoes mb-4">
        <button
          className={`px-4 py-2 rounded ${secaoAtiva === "visaoGeral" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSecaoAtiva("visaoGeral")}
        >
          Visão Geral
        </button>
        <button
          className={`px-4 py-2 rounded ${secaoAtiva === "tratamentos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSecaoAtiva("tratamentos")}
        >
          Tratamentos
        </button>
        <button
          className={`px-4 py-2 rounded ${secaoAtiva === "anamnese" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSecaoAtiva("anamnese")}
        >
          Anamnese
        </button>
        <button
          className={`px-4 py-2 rounded ${secaoAtiva === "consultas" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSecaoAtiva("consultas")}
        >
          Consultas
        </button>
      </div>

      {/* Card da seção ativa */}
      <div className="card-secao p-4 bg-white shadow rounded">
        {secaoAtiva === "visaoGeral" && <VisaoGeral pacienteId={pacienteId} />}
        {secaoAtiva === "anamnese" && <Anamnese pacienteId={pacienteId} />}
        {secaoAtiva === "tratamentos" && <Tratamentos pacienteId={pacienteId} />}
        {secaoAtiva === "consultas" && <Consultas pacienteId={pacienteId} />}
      </div>

      {/* Botão fixo de excluir paciente */}
      <button
        onClick={excluirPaciente}
        className="fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded shadow-lg"
      >
        Excluir Paciente
      </button>
    </div>
  );
}
