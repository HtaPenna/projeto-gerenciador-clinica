import React, { useState, useEffect } from "react";
import axios from "axios";
import pacienteForm from "./components/pacienteForm";
import pacienteLista from "./components/pacienteLista";

function App() {
  const [pacientes, setPacientes] = useState([]);

  const carregarPacientes = async () => {
    const resposta = await axios.get("http://localhost:3001/pacientes");
    setPacientes(resposta.data);
  };

  const adicionarPaciente = async (paciente) => {
    const resposta = await axios.post("http://localhost:3001/pacientes", paciente);
    setPacientes([...pacientes, resposta.data]);
  };

  const atualizarPaciente = async (id, atualizacao) => {
    const resposta = await axios.patch(`http://localhost:3001/pacientes/${id}`, atualizacao);
    setPacientes(pacientes.map(p => p.id === id ? resposta.data : p));
  };

  const deletarPaciente = async (id) => {
    await axios.delete(`http://localhost:3001/pacientes/${id}`);
    setPacientes(pacientes.filter(p => p.id !== id));
  };

  useEffect(() => {
    carregarPacientes();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Cadastro de Pacientes</h1>
      <PacienteForm onAdicionar={adicionarPaciente} />
      <PacienteLista
        pacientes={pacientes}
        onAtualizar={atualizarPaciente}
        onDeletar={deletarPaciente}
      />
    </div>
  );
}

export default App;
