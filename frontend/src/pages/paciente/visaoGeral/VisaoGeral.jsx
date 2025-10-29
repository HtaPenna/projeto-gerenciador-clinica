import React, { useState, useEffect } from "react";

const API_PACIENTES = "http://localhost:3001/pacientes";

export default function VisaoGeral({ pacienteId }) {
  const [paciente, setPaciente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});

  const carregarPaciente = async () => {
    try {
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`);
      if (res.status === 404) {
        setPaciente(null);
        return;
      }
      const data = await res.json();
      setPaciente(data);
      setFormData(data); // inicializa formData
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPaciente();
  }, [pacienteId]);

  if (!paciente) return <p>Carregando dados do paciente...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Erro ao atualizar paciente");
      const data = await res.json();
      setPaciente(data);
      setEditando(false);
      alert("Informações atualizadas!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    }
  };

  return (
    <div className="card-visao-geral p-4 bg-white shadow rounded mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="mb-0">Informações</h2>
        <button
          onClick={() => setEditando(!editando)}
          className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      {/* Identificação */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Identificação</h3>
        {["cpf","dataNascimento"].map((field) => (
          <p key={field}>
            <strong>{field === "cpf" ? "CPF" : "Data de Nascimento"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      {/* Contatos e Comunicação */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Contatos e Comunicação</h3>
        {["telefoneCelular","telefoneResidencial","telefoneEmergencia","redesSociais"].map((field) => (
          <p key={field}>
            <strong>{field === "telefoneCelular" ? "Telefone Celular" :
                     field === "telefoneResidencial" ? "Telefone Residencial" :
                     field === "telefoneEmergencia" ? "Telefone Emergência" : "Redes Sociais"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      {/* Endereço Residencial */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Endereço Residencial</h3>
        {["cep","logradouro","bairro","cidade","estado"].map((field) => (
          <p key={field}>
            <strong>{field === "cep" ? "CEP" :
                     field === "logradouro" ? "Logradouro" :
                     field === "bairro" ? "Bairro" : 
                     field === "cidade" ? "Cidade" : "Estado" }:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      {/* Parâmetros Biomédicos */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Parâmetros Biomédicos</h3>
        {["genero","peso","altura","tipoSanguineo"].map((field) => (
          <p key={field}>
            <strong>{field === "genero" ? "Gênero" :
                     field === "peso" ? "Peso" :
                     field === "altura" ? "Altura" : "Tipo Sanguíneo"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      {/* Dados Pessoais */}
      <div className="mb-2">
        <h3 className="font-semibold text-sm">Dados Pessoais</h3>
        {["estadoCivil","profissao"].map((field) => (
          <p key={field}>
            <strong>{field === "estadoCivil" ? "Estado Civil" : "Profissão"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="border p-1 rounded w-full"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      {editando && (
        <button
          onClick={handleSalvar}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          Salvar
        </button>
      )}
    </div>
  );
}
