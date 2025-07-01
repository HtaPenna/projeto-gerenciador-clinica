import { useState } from "react";

export default function CadastroPaciente() {
  const [paciente, setPaciente] = useState({
    nome: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resposta = await fetch("http://localhost:3001/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente)
      });

      if (resposta.ok) {
        alert("Paciente cadastrado com sucesso!");
        setPaciente({ nome: "", email: "", telefone: "" });
      } else {
        alert("Erro ao cadastrar paciente.");
      }
    } catch (erro) {
      console.error("Erro:", erro);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro de Paciente</h2>
      <label>
        Nome:
        <input type="text" name="nome" value={paciente.nome} onChange={handleChange} required />
      </label>
      <br />
      <label>
        E-mail:
        <input type="email" name="email" value={paciente.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Telefone:
        <input type="text" name="telefone" value={paciente.telefone} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
