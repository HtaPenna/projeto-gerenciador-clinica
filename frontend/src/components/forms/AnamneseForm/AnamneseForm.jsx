import React, { useState, useEffect } from "react";
import { useToast } from '../../../hooks/useToast.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AnamneseForm({ anamnese, onSalvar, onCancelar, hideTitle = false }) {
  const { addToast } = useToast();
  
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const condicoesOptions = [
    "Anemia", "Asma", "Cancêr", "Cefaleia", "Convulsões", "Desmaio", 
    "Diabete", "Derrame", "DTSs", "Depressão", "Hepatite", "Hipertensão", 
    "Insuficiência renal", "Problema cardíaco", "Problema respiratório", "Nenhum"
  ];

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
      let condicoes = new Set(prev.condicoesSaude);
      
      if (value === "Nenhum") {
        if (checked) {
          condicoes = new Set(["Nenhum"]);
        } else {
          condicoes.delete("Nenhum");
        }
      } else {
        if (checked) {
          condicoes.delete("Nenhum");
          condicoes.add(value);
        } else {
          condicoes.delete(value);
        }
      }
      
      return { ...prev, condicoesSaude: Array.from(condicoes) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSalvar(formData);
    } catch (error) {
      addToast("Erro ao salvar anamnese", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="">
        <div className="card-body">
          {!hideTitle && (
            <h5 className="border-bottom pb-2 mb-4">Formulário de Anamnese</h5>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Seção 1: Queixa Principal */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">1. Motivo da Consulta</h6>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Motivo pelo qual procurou tratamento? *</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  name="queixaPrincipal" 
                  value={formData.queixaPrincipal} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Seção 2: Condições de Saúde */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">2. Histórico de Saúde</h6>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label mb-3">Já sofreu ou sofre de: *</label>
                <div className="row">
                  {condicoesOptions.map((condicao) => (
                    <div key={condicao} className="col-md-6 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="condicoesSaude"
                          value={condicao}
                          checked={formData.condicoesSaude.includes(condicao)}
                          onChange={handleCondicoesChange}
                          id={`condicao-${condicao}`}
                        />
                        <label className="form-check-label" htmlFor={`condicao-${condicao}`}>
                          {condicao}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seção 3: Tratamentos e Medicamentos */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">3. Tratamentos e Medicamentos</h6>
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label">Está em algum tratamento médico? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="antecedentesMedicos" 
                  value={formData.antecedentesMedicos} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Está tomando alguma medicação? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="usoMedicamentos" 
                  value={formData.usoMedicamentos} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Tem alergia a alguma medicação? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="alergias" 
                  value={formData.alergias} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Tem problema de cicatrização? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="sobreCicatrizacao" 
                  value={formData.sobreCicatrizacao} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Seção 4: Hábitos */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">4. Hábitos</h6>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="fumante" 
                    checked={formData.fumante} 
                    onChange={handleChange}
                    id="fumante"
                  />
                  <label className="form-check-label" htmlFor="fumante">
                    Fuma? *
                  </label>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="consumoBebidasAlcoolicas" 
                    checked={formData.consumoBebidasAlcoolicas} 
                    onChange={handleChange}
                    id="alcool"
                  />
                  <label className="form-check-label" htmlFor="alcool">
                    Ingere bebida alcoólica? *
                  </label>
                </div>
              </div>

              <div className="col-md-4 mb-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="dificuldadeRespiratoria" 
                    checked={formData.dificuldadeRespiratoria} 
                    onChange={handleChange}
                    id="respiratoria"
                  />
                  <label className="form-check-label" htmlFor="respiratoria">
                    Dificuldade respiratória? *
                  </label>
                </div>
              </div>
            </div>

            {/* Seção 5: Histórico Odontológico */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">5. Histórico Odontológico</h6>
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label">Tem ou teve problema digestivo? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="problemaDigestivo" 
                  value={formData.problemaDigestivo} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Quando foi seu último tratamento odontológico? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="ultimoTratamento" 
                  value={formData.ultimoTratamento} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Seção 6: Saúde Bucal */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="border-bottom pb-2">6. Saúde Bucal</h6>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="satisfacaoSorriso" 
                    checked={formData.satisfacaoSorriso} 
                    onChange={handleChange}
                    id="sorriso"
                  />
                  <label className="form-check-label" htmlFor="sorriso">
                    Insatisfeito com o sorriso? *
                  </label>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="dentesBrancos" 
                    checked={formData.dentesBrancos} 
                    onChange={handleChange}
                    id="brancos"
                  />
                  <label className="form-check-label" htmlFor="brancos">
                    Quer dentes mais brancos? *
                  </label>
                </div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Sente dor ou sensibilidade em algum dente? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="sensibilidadeDentes" 
                  value={formData.sensibilidadeDentes} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Quando usa fio dental prende ou desfia em algum lugar? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="usoFioDental" 
                  value={formData.usoFioDental} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Recebeu orientação de higiene bucal? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="orientacaoBucal" 
                  value={formData.orientacaoBucal} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Tem dificuldade, dor ou desconforto ao abrir a boca ou ao bocejar? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="desconfortoBucal" 
                  value={formData.desconfortoBucal} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Meus maxilares ficam rígidos, apertados ou cansados com regularidade? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="sobreMaxilar" 
                  value={formData.sobreMaxilar} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Já usou placa de mordida? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="placaMordida" 
                  value={formData.placaMordida} 
                  onChange={handleChange} 
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Qual seu grau de tensão e/ou ansiedade no dentista? *</label>
                <textarea 
                  className="form-control"
                  rows="2"
                  name="grauTensao" 
                  value={formData.grauTensao} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancelar}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {anamnese?.id ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  anamnese?.id ? "Atualizar Anamnese" : "Salvar Anamnese"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}