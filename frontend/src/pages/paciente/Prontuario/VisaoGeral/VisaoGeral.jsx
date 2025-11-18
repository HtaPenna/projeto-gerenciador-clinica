import React, { useState, useEffect } from "react";
import { useAuth } from '../../../../hooks/useAuth';
import "./VisaoGeral.css";

const API_PACIENTES = "http://localhost:3001/pacientes";

export default function VisaoGeral({ pacienteId }) {
  const [paciente, setPaciente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();

  const carregarPaciente = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        setPaciente(null);
        return;
      }

      if (!res.ok) throw new Error("Erro ao carregar paciente");

      const data = await res.json();
      setPaciente(data);
      setFormData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPaciente();
  }, [pacienteId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const response = await fetch(`${API_PACIENTES}/${pacienteId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar paciente");

      const data = await response.json();
      setPaciente(data);
      setEditando(false);
      alert("Informações atualizadas!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    }
  };

  if (loading) return <p>Carregando dados do paciente...</p>;
  if (!paciente) return <p>Paciente não encontrado.</p>;

  return (
    <div className="infoContainer">
      <div className="tituloContainer">
        <h2>Informações</h2>
        <button
          onClick={() => setEditando(!editando)}
          className={editando ? "cancelar" : "editar"}
        >
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="info">
        <h3 className="tituloInfo">Identificação</h3>
        {["cpf", "dataNascimento"].map((field) => (
          <p key={field}>
            <strong>{field === "cpf" ? "CPF" : "Data de Nascimento"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="inputEditando"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      <div className="info">
        <h3 className="tituloInfo">Contatos e Comunicação</h3>
        {["telefoneCelular", "telefoneResidencial", "telefoneEmergencia", "redesSociais"].map((field) => (
          <p key={field}>
            <strong>{field === "telefoneCelular" ? "Telefone Celular" :
              field === "telefoneResidencial" ? "Telefone Residencial" :
                field === "telefoneEmergencia" ? "Telefone Emergência" : "Redes Sociais"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="inputEditando"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      <div className="info">
        <h3 className="tituloInfo">Endereço Residencial</h3>
        {["cep", "logradouro", "bairro", "cidade", "estado"].map((field) => (
          <p key={field}>
            <strong>{field === "cep" ? "CEP" :
              field === "logradouro" ? "Logradouro" :
                field === "bairro" ? "Bairro" :
                  field === "cidade" ? "Cidade" : "Estado"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="inputEditando"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      <div className="info">
        <h3 className="tituloInfo">Parâmetros Biomédicos</h3>
        {["genero", "peso", "altura", "tipoSanguineo"].map((field) => (
          <p key={field}>
            <strong>{field === "genero" ? "Gênero" :
              field === "peso" ? "Peso" :
                field === "altura" ? "Altura" : "Tipo Sanguíneo"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="inputEditando"
              />
            ) : (
              paciente[field]
            )}
          </p>
        ))}
      </div>

      <div className="info">
        <h3 className="tituloInfo">Dados Pessoais</h3>
        {["estadoCivil", "profissao"].map((field) => (
          <p key={field}>
            <strong>{field === "estadoCivil" ? "Estado Civil" : "Profissão"}:</strong>{" "}
            {editando ? (
              <input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="inputEditando"
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
          className="btnSalvarInfo"
        >
          Salvar
        </button>
      )}
    </div>
  );
}