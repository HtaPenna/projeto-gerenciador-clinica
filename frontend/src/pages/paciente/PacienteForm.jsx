import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const generoOptions = ["Masculino", "Feminino", "Outro"];

export default function PacienteForm({ paciente, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    id: null,
    nome: "",
    telefoneCelular: "",
    dataNascimento: "",
    telefoneResidencial: "",
    idade: "",
    peso: "",
    altura: "",
    tipoSanguineo: "",
    profissao: "",
    cpf: "",
    rg: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    email: "",
    genero: "",
    estadoCivil: "",
    nomeConjuge: "",
    telefoneEmergencia: "",
    redesSociais: "",
    assinatura: "",
  });

  useEffect(() => {
    if (paciente) {
      setFormData({
        id: paciente.id || null,
        nome: paciente.nome || "",
        telefoneCelular: paciente.telefoneCelular || "",
        dataNascimento: paciente.dataNascimento ? paciente.dataNascimento.split("T")[0] : "",
        telefoneResidencial: paciente.telefoneResidencial || "",
        idade: paciente.idade || "",
        peso: paciente.peso || "",
        altura: paciente.altura || "",
        tipoSanguineo: paciente.tipoSanguineo || "",
        profissao: paciente.profissao || "",
        cpf: paciente.cpf || "",
        rg: paciente.rg || "",
        endereco: paciente.endereco || "",
        cidade: paciente.cidade || "",
        estado: paciente.estado || "",
        cep: paciente.cep || "",
        email: paciente.email || "",
        genero: paciente.genero || "",
        estadoCivil: paciente.estadoCivil || "",
        nomeConjuge: paciente.nomeConjuge || "",
        telefoneEmergencia: paciente.telefoneEmergencia || "",
        redesSociais: paciente.redesSociais || "",
        assinatura: paciente.assinatura || "",
      });
    } else {
      setFormData({
        id: null,
        nome: "",
        telefoneCelular: "",
        dataNascimento: "",
        telefoneResidencial: "",
        idade: "",
        peso: "",
        altura: "",
        tipoSanguineo: "",
        profissao: "",
        cpf: "",
        rg: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        email: "",
        genero: "",
        estadoCivil: "",
        nomeConjuge: "",
        telefoneEmergencia: "",
        redesSociais: "",
        assinatura: "",
      });
    }
  }, [paciente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.telefoneCelular ||
      !formData.dataNascimento ||
      !formData.idade ||
      !formData.cpf ||
      !formData.rg ||
      !formData.endereco ||
      !formData.cidade ||
      !formData.estado ||
      !formData.cep ||
      !formData.email ||
      !formData.genero
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    console.log("Paciente enviado pelo formulário:", formData);
    onSalvar(formData);
  };

  return (
    <div class="bootstrap-scope">
      <form onSubmit={handleSubmit}>
        <h2>{paciente ? "Editar Paciente" : "Novo Paciente"}</h2>

      <div className="formGroup">
        <label>Nome</label>
        <input name="nome" value={formData.nome} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Telefone Celular</label>
        <input name="telefoneCelular" value={formData.telefoneCelular} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Data de Nascimento</label>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
        />
      </div>

      <div className="formGroup">
        <label>Telefone Residencial</label>
        <input name="telefoneResidencial" value={formData.telefoneResidencial} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Idade</label>
        <input
          type="number"
          name="idade"
          value={formData.idade}
          onChange={handleChange}
          required
          min={0}
        />
      </div>

      <div className="formGroup">
        <label>Peso</label>
        <input name="peso" value={formData.peso} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Altura</label>
        <input name="altura" value={formData.altura} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Tipo Sanguíneo</label>
        <input name="tipoSanguineo" value={formData.tipoSanguineo} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Profissão</label>
        <input name="profissao" value={formData.profissao} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>CPF</label>
        <input name="cpf" value={formData.cpf} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>RG</label>
        <input name="rg" value={formData.rg} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Endereço</label>
        <input name="endereco" value={formData.endereco} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Cidade</label>
        <input name="cidade" value={formData.cidade} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Estado</label>
        <input name="estado" value={formData.estado} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>CEP</label>
        <input name="cep" value={formData.cep} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Gênero</label>
        <select name="genero" value={formData.genero} onChange={handleChange} required>
          <option value="">--Selecione--</option>
          {generoOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label>Estado Civil</label>
        <input name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Nome do Cônjuge</label>
        <input name="nomeConjuge" value={formData.nomeConjuge} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Telefone Emergência</label>
        <input name="telefoneEmergencia" value={formData.telefoneEmergencia} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Redes Sociais</label>
        <input name="redesSociais" value={formData.redesSociais} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Assinatura</label>
        <textarea name="assinatura" value={formData.assinatura} onChange={handleChange} />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">{paciente ? "Atualizar" : "Salvar"}</button>
        <button
          type="button"
          onClick={onCancelar}
          style={{ marginLeft: "10px" }}
        >
          Cancelar
        </button>
      </div>

    </form>
  );
}
