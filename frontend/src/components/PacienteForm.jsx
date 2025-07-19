import React, { useState, useEffect } from "react";

const sexoOptions = ["Masculino", "Feminino", "Outro"];

export default function PacienteForm({ paciente, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    Codigo_Pac: null,  // Adicionado aqui
    Nome_Pac: "",
    Tel_Pac: "",
    DataNasc_Pac: "",
    TelResid_Pac: "",
    Idade_Pac: "",
    Peso_Pac: "",
    Altura_Pac: "",
    TipoSang_Pac: "",
    Profissao_Pac: "",
    CPF_Pac: "",
    RG_Pac: "",
    Endereco_Pac: "",
    Cidade_Pac: "",
    Estado_Pac: "",
    CEP_Pac: "",
    Email_Pac: "",
    Sexo_Pac: "",
    EstCivil_Pac: "",
    NomeConjuge_Pac: "",
    TelEmergencia_Pac: "",
    RedesSociais_Pac: "",
    Assinatura_Pac: "",
    });

useEffect(() => {
  if (paciente) {
    setFormData({
      Codigo_Pac: paciente.Codigo_Pac || null,  // Adicionado aqui
      Nome_Pac: paciente.Nome_Pac || "",
      Tel_Pac: paciente.Tel_Pac || "",
      DataNasc_Pac: paciente.DataNasc_Pac ? paciente.DataNasc_Pac.split("T")[0] : "",
      TelResid_Pac: paciente.TelResid_Pac || "",
      Idade_Pac: paciente.Idade_Pac || "",
      Peso_Pac: paciente.Peso_Pac || "",
      Altura_Pac: paciente.Altura_Pac || "",
      TipoSang_Pac: paciente.TipoSang_Pac || "",
      Profissao_Pac: paciente.Profissao_Pac || "",
      CPF_Pac: paciente.CPF_Pac || "",
      RG_Pac: paciente.RG_Pac || "",
      Endereco_Pac: paciente.Endereco_Pac || "",
      Cidade_Pac: paciente.Cidade_Pac || "",
      Estado_Pac: paciente.Estado_Pac || "",
      CEP_Pac: paciente.CEP_Pac || "",
      Email_Pac: paciente.Email_Pac || "",
      Sexo_Pac: paciente.Sexo_Pac || "",
      EstCivil_Pac: paciente.EstCivil_Pac || "",
      NomeConjuge_Pac: paciente.NomeConjuge_Pac || "",
      TelEmergencia_Pac: paciente.TelEmergencia_Pac || "",
      RedesSociais_Pac: paciente.RedesSociais_Pac || "",
      Assinatura_Pac: paciente.Assinatura_Pac || "",
    });
  } else {
    setFormData({
      Codigo_Pac: null,  // Adicionado aqui
      Nome_Pac: "",
      Tel_Pac: "",
      DataNasc_Pac: "",
      TelResid_Pac: "",
      Idade_Pac: "",
      Peso_Pac: "",
      Altura_Pac: "",
      TipoSang_Pac: "",
      Profissao_Pac: "",
      CPF_Pac: "",
      RG_Pac: "",
      Endereco_Pac: "",
      Cidade_Pac: "",
      Estado_Pac: "",
      CEP_Pac: "",
      Email_Pac: "",
      Sexo_Pac: "",
      EstCivil_Pac: "",
      NomeConjuge_Pac: "",
      TelEmergencia_Pac: "",
      RedesSociais_Pac: "",
      Assinatura_Pac: "",
    });
  }
}, [paciente]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação (mesmo que já tenha)
    if (
        !formData.Nome_Pac ||
        !formData.Tel_Pac ||
        !formData.DataNasc_Pac ||
        !formData.Idade_Pac ||
        !formData.CPF_Pac ||
        !formData.RG_Pac ||
        !formData.Endereco_Pac ||
        !formData.Cidade_Pac ||
        !formData.Estado_Pac ||
        !formData.CEP_Pac ||
        !formData.Email_Pac ||
        !formData.Sexo_Pac
    ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

        console.log("Paciente enviado pelo formulário:", formData);
        onSalvar(formData);
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>{paciente ? "Editar Paciente" : "Novo Paciente"}</h2>

      <label>Nome*:</label>
      <input name="Nome_Pac" value={formData.Nome_Pac} onChange={handleChange} required />

      <label>Telefone*:</label>
      <input name="Tel_Pac" value={formData.Tel_Pac} onChange={handleChange} required />

      <label>Data de Nascimento*:</label>
      <input
        type="date"
        name="DataNasc_Pac"
        value={formData.DataNasc_Pac}
        onChange={handleChange}
        required
      />

      <label>Telefone Residencial:</label>
      <input name="TelResid_Pac" value={formData.TelResid_Pac} onChange={handleChange} />

      <label>Idade*:</label>
      <input
        type="number"
        name="Idade_Pac"
        value={formData.Idade_Pac}
        onChange={handleChange}
        required
        min={0}
      />

      <label>Peso:</label>
      <input name="Peso_Pac" value={formData.Peso_Pac} onChange={handleChange} />

      <label>Altura:</label>
      <input name="Altura_Pac" value={formData.Altura_Pac} onChange={handleChange} />

      <label>Tipo Sanguíneo:</label>
      <input name="TipoSang_Pac" value={formData.TipoSang_Pac} onChange={handleChange} />

      <label>Profissão:</label>
      <input name="Profissao_Pac" value={formData.Profissao_Pac} onChange={handleChange} />

      <label>CPF*:</label>
      <input name="CPF_Pac" value={formData.CPF_Pac} onChange={handleChange} required />

      <label>RG*:</label>
      <input name="RG_Pac" value={formData.RG_Pac} onChange={handleChange} required />

      <label>Endereço*:</label>
      <input name="Endereco_Pac" value={formData.Endereco_Pac} onChange={handleChange} required />

      <label>Cidade*:</label>
      <input name="Cidade_Pac" value={formData.Cidade_Pac} onChange={handleChange} required />

      <label>Estado*:</label>
      <input name="Estado_Pac" value={formData.Estado_Pac} onChange={handleChange} required />

      <label>CEP*:</label>
      <input name="CEP_Pac" value={formData.CEP_Pac} onChange={handleChange} required />

      <label>Email*:</label>
      <input type="email" name="Email_Pac" value={formData.Email_Pac} onChange={handleChange} required />

      <label>Sexo*:</label>
      <select name="Sexo_Pac" value={formData.Sexo_Pac} onChange={handleChange} required>
        <option value="">--Selecione--</option>
        {sexoOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label>Estado Civil:</label>
      <input name="EstCivil_Pac" value={formData.EstCivil_Pac} onChange={handleChange} />

      <label>Nome do Cônjuge:</label>
      <input name="NomeConjuge_Pac" value={formData.NomeConjuge_Pac} onChange={handleChange} />

      <label>Telefone Emergência:</label>
      <input name="TelEmergencia_Pac" value={formData.TelEmergencia_Pac} onChange={handleChange} />

      <label>Redes Sociais:</label>
      <input name="RedesSociais_Pac" value={formData.RedesSociais_Pac} onChange={handleChange} />

      <label>Assinatura:</label>
      <textarea name="Assinatura_Pac" value={formData.Assinatura_Pac} onChange={handleChange} />

      <button type="submit">{paciente ? "Atualizar" : "Criar"}</button>
      {paciente && (
        <button type="button" onClick={onCancelar} style={{ marginLeft: "10px" }}>
          Cancelar
        </button>
      )}
    </form>
  );
}
