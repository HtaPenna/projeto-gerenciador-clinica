import React, { useState, useEffect } from "react";

export default function AnamneseForm({ anamnese, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    queixaPrincipal: "",
    condicoesSaude: [],
    antecedentesMedicos: "",
    usoMedicamentos: "",
    alergias: "",
    sobreCicatrizacao: "",
    fumante: false,
    consumoBebidasAlcoolicas: false,
    dificuldadeRespiratoria: false,
    problemaDigestivo: "",
    ultimoTratamento: "",
    satisfacaoSorriso: false,
    dentesBrancos: false,
    sensibilidadeDentes: "",
    usoFioDental: "",
    orientacaoBucal: "",
    desconfortoBucal: "",
    sobreMaxilar: "",
    placaMordida: "",
    grauTensao: "",
    id: null,
    pacienteId: null
  });

  useEffect(() => {
    if (anamnese) {
      setFormData({
        queixaPrincipal: anamnese.queixaPrincipal || "",
        condicoesSaude: anamnese.condicoesSaude || [],
        antecedentesMedicos: anamnese.antecedentesMedicos || "",
        usoMedicamentos: anamnese.usoMedicamentos || "",
        alergias: anamnese.alergias || "",
        sobreCicatrizacao: anamnese.sobreCicatrizacao || "",
        fumante: anamnese.fumante || false,
        consumoBebidasAlcoolicas: anamnese.consumoBebidasAlcoolicas || false,
        dificuldadeRespiratoria: anamnese.dificuldadeRespiratoria || false,
        problemaDigestivo: anamnese.problemaDigestivo || "",
        ultimoTratamento: anamnese.ultimoTratamento || "",
        satisfacaoSorriso: anamnese.satisfacaoSorriso || false,
        dentesBrancos: anamnese.dentesBrancos || false,
        sensibilidadeDentes: anamnese.sensibilidadeDentes || "",
        usoFioDental: anamnese.usoFioDental || "",
        orientacaoBucal: anamnese.orientacaoBucal || "",
        desconfortoBucal: anamnese.desconfortoBucal || "",
        sobreMaxilar: anamnese.sobreMaxilar || "",
        placaMordida: anamnese.placaMordida || "",
        grauTensao: anamnese.grauTensao || "",
        id: anamnese.id || null,
        pacienteId: anamnese.pacienteId || null
      });
    }
  }, [anamnese]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCondicoesChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const condicoes = new Set(prev.condicoesSaude);
      if (checked) condicoes.add(value);
      else condicoes.delete(value);
      return { ...prev, condicoesSaude: Array.from(condicoes) };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
  };

  const condicoesOptions = ["Anemia", "Asma", "Cancêr", "Cefaleia", "Diabetes", "Hipertensão", "Cardiopatias", "Outros"];

  return (
    <form onSubmit={handleSubmit}>
      <div className="formGroup">
        <label>Queixa Principal*</label>
        <textarea name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} required />
      </div>

      <div className="formGroup">
        <label>Condições de Saúde*</label>
        {condicoesOptions.map((c) => (
          <div key={c}>
            <input
              type="checkbox"
              name="condicoesSaude"
              value={c}
              checked={formData.condicoesSaude.includes(c)}
              onChange={handleCondicoesChange}
            />
            <label>{c}</label>
          </div>
        ))}
      </div>

      <div className="formGroup">
        <label>Antecedentes Médicos*</label>
        <textarea name="antecedentesMedicos" value={formData.antecedentesMedicos} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Uso de Medicamentos*</label>
        <textarea name="usoMedicamentos" value={formData.usoMedicamentos} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Alergias*</label>
        <textarea name="alergias" value={formData.alergias} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Sobre Cicatrização*</label>
        <textarea name="sobreCicatrizacao" value={formData.sobreCicatrizacao} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Fumante*</label>
        <input type="checkbox" name="fumante" checked={formData.fumante} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Consumo de Bebidas Alcoólicas*</label>
        <input type="checkbox" name="consumoBebidasAlcoolicas" checked={formData.consumoBebidasAlcoolicas} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Dificuldade Respiratória*</label>
        <input type="checkbox" name="dificuldadeRespiratoria" checked={formData.dificuldadeRespiratoria} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Problema Digestivo*</label>
        <textarea name="problemaDigestivo" value={formData.problemaDigestivo} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Último Tratamento*</label>
        <textarea name="ultimoTratamento" value={formData.ultimoTratamento} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Satisfação com o Sorriso*</label>
        <input type="checkbox" name="satisfacaoSorriso" checked={formData.satisfacaoSorriso} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Dentes Brancos*</label>
        <input type="checkbox" name="dentesBrancos" checked={formData.dentesBrancos} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Sensibilidade nos Dentes*</label>
        <textarea name="sensibilidadeDentes" value={formData.sensibilidadeDentes} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Uso de Fio Dental*</label>
        <textarea name="usoFioDental" value={formData.usoFioDental} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Orientação Bucal*</label>
        <textarea name="orientacaoBucal" value={formData.orientacaoBucal} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Desconforto Bucal*</label>
        <textarea name="desconfortoBucal" value={formData.desconfortoBucal} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Sobre Maxilar*</label>
        <textarea name="sobreMaxilar" value={formData.sobreMaxilar} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Placa de Mordida*</label>
        <textarea name="placaMordida" value={formData.placaMordida} onChange={handleChange} />
      </div>

      <div className="formGroup">
        <label>Grau de Tensão*</label>
        <textarea name="grauTensao" value={formData.grauTensao} onChange={handleChange} />
      </div>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">{anamnese ? "Atualizar" : "Salvar"}</button>
        <button type="button" onClick={onCancelar} style={{ marginLeft: "10px" }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
