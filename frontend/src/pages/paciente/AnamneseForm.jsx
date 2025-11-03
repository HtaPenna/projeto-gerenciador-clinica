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

  const condicoesOptions = [
    "Anemia", "Asma", "Cancêr", "Cefaleia", "Convulsões", "Desmaio", 
    "Diabete", "Derrame", "DTSs", "Depressão", "Hepatite", "Hipertensão", 
    "Insuficiência renal", "Problema cardíaco", "Problema respiratório", "Nenhum"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* 1 */}
      <div className="formGroup">
        <label>1. Motivo pelo qual procurou tratamento?*</label>
        <textarea name="queixaPrincipal" value={formData.queixaPrincipal} onChange={handleChange} required />
      </div>

      {/* 2 */}
      <div className="formGroup">
        <label>2. Já sofreu ou sofre de:*</label>
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

      {/* 3 a 6 */}
      <div className="formGroup">
        <label>3. Está em algum tratamento médico?*</label>
        <textarea name="antecedentesMedicos" value={formData.antecedentesMedicos} onChange={handleChange} />
        
        <label>4. Está tomando alguma medicação?*</label>
        <textarea name="usoMedicamentos" value={formData.usoMedicamentos} onChange={handleChange} />
        
        <label>5. Tem alergia a alguma medicação?*</label>
        <textarea name="alergias" value={formData.alergias} onChange={handleChange} />
        
        <label>6. Tem problema de cicatrização?*</label>
        <textarea name="sobreCicatrizacao" value={formData.sobreCicatrizacao} onChange={handleChange} />
      </div>

      {/* 7 a 9 */}
      <div className="formGroup">
        <label>7. Fuma?*</label>
        <input type="checkbox" name="fumante" checked={formData.fumante} onChange={handleChange} />

        <label>8. Ingere bebida alcoólica?*</label>
        <input type="checkbox" name="consumoBebidasAlcoolicas" checked={formData.consumoBebidasAlcoolicas} onChange={handleChange} />

        <label>9. Tem alguma dificuldade de respiração ou obstrução de vias aéreas?*</label>
        <input type="checkbox" name="dificuldadeRespiratoria" checked={formData.dificuldadeRespiratoria} onChange={handleChange} />
      </div>

      {/* 10 a 11 */}
      <div className="formGroup">
        <label>10. Tem ou teve problema digestivo?*</label>
        <textarea name="problemaDigestivo" value={formData.problemaDigestivo} onChange={handleChange} />
        
        <label>11. Quando foi seu último tratamento odontológico?*</label>
        <textarea name="ultimoTratamento" value={formData.ultimoTratamento} onChange={handleChange} />
      </div>

      {/* 12 a 20 */}
      <div className="formGroup">
        <label>12. Está insatisfeito com o seu sorriso?*</label>
        <input type="checkbox" name="satisfacaoSorriso" checked={formData.satisfacaoSorriso} onChange={handleChange} />

        <label>13. Gostaria de ter dentes mais brancos?*</label>
        <input type="checkbox" name="dentesBrancos" checked={formData.dentesBrancos} onChange={handleChange} />

        <label>14. Sente dor ou sensibilidade em algum dente?*</label>
        <textarea name="sensibilidadeDentes" value={formData.sensibilidadeDentes} onChange={handleChange} />

        <label>15. Quando usa fio dental prende ou desfia em algum lugar?*</label>
        <textarea name="usoFioDental" value={formData.usoFioDental} onChange={handleChange} />

        <label>16. Recebeu orientação de higiene bucal?*</label>
        <textarea name="orientacaoBucal" value={formData.orientacaoBucal} onChange={handleChange} />

        <label>17. Tem dificuldade, dor ou desconforto ao abrir a boca ou ao bocejar?*</label>
        <textarea name="desconfortoBucal" value={formData.desconfortoBucal} onChange={handleChange} />

        <label>18. Meus maxilares ficam rígidos, apertados ou cansados com regularidade?*</label>
        <textarea name="sobreMaxilar" value={formData.sobreMaxilar} onChange={handleChange} />

        <label>19. Já usou placa de mordida?*</label>
        <textarea name="placaMordida" value={formData.placaMordida} onChange={handleChange} />

        <label>20. Qual seu grau de tensão e/ou ansiedade no dentista?*</label>
        <textarea name="grauTensao" value={formData.grauTensao} onChange={handleChange} />
      </div>

      <div className="flex space-x-2 mt-2">
        <button type="submit">{anamnese ? "Atualizar" : "Salvar"}</button>
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}
