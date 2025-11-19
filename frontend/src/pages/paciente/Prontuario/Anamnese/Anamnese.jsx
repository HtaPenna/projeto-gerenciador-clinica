import React, { useState, useEffect } from "react";
import { useAuth } from '../../../../hooks/useAuth';
import "./Anamnese.css";

const API_ANAMNESES = "http://localhost:3001/anamneses";

export default function Anamnese({ pacienteId }) {
  const [anamnese, setAnamnese] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const { getAuthHeaders } = useAuth();

  const carregarAnamnese = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ANAMNESES}/paciente/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        setAnamnese(null);
        setFormData({});
        return;
      } else if (!res.ok) {
        throw new Error("Erro ao carregar anamnese");
      } else {
        const data = await res.json();
        setAnamnese(data);
        setFormData(data);
      }
    } catch (err) {
      if (!err.message.includes('404')) {
        console.error('Erro ao verificar anamnese:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAnamnese();
  }, [pacienteId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCriarAnamnese = async () => {
    try {
      const res = await fetch(API_ANAMNESES, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pacienteId,
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
          grauTensao: ""
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar anamnese");

      const data = await res.json();
      setAnamnese(data);
      setFormData(data);
      setEditando(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar anamnese");
    }
  };

  const handleSalvar = async () => {
    try {
      const url = `${API_ANAMNESES}/${formData.id}`;
      const method = "PATCH";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao salvar anamnese");

      const data = await res.json();
      setAnamnese(data);
      setEditando(false);
      alert("Anamnese atualizada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar anamnese");
    }
  };

  const formatBool = (value) => (value ? "Sim" : "Não");

  const campos = [
    { label: "1. Motivo pelo qual procurou tratamento?", name: "queixaPrincipal" },
    { label: "2. Já sofreu ou sofre de:", name: "condicoesSaude", isArray: true },
    { label: "3. Está em algum tratamento médico?", name: "antecedentesMedicos" },
    { label: "4. Está tomando alguma medicação?", name: "usoMedicamentos" },
    { label: "5. Tem alergia a alguma medicação?", name: "alergias" },
    { label: "6. Tem problema de cicatrização?", name: "sobreCicatrizacao" },
    { label: "7. Fuma?", name: "fumante", isBool: true },
    { label: "8. Ingere bebida alcoólica?", name: "consumoBebidasAlcoolicas", isBool: true },
    { label: "9. Tem alguma dificuldade de respiração ou obstrução de vias aéreas?", name: "dificuldadeRespiratoria", isBool: true },
    { label: "10. Tem ou teve problema digestivo?", name: "problemaDigestivo" },
    { label: "11. Quando foi seu último tratamento odontológico?", name: "ultimoTratamento" },
    { label: "12. Está insatisfeito com o seu sorriso?", name: "satisfacaoSorriso", isBool: true },
    { label: "13. Gostaria de ter dentes mais brancos?", name: "dentesBrancos", isBool: true },
    { label: "14. Sente dor ou sensibilidade em algum dente?", name: "sensibilidadeDentes" },
    { label: "15. Quando usa fio dental prende ou desfia em algum lugar?", name: "usoFioDental" },
    { label: "16. Recebeu orientação de higiene bucal?", name: "orientacaoBucal" },
    { label: "17. Tem dificuldade, dor ou ambor ao abrir a boca ou ao bocejar?", name: "desconfortoBucal" },
    { label: "18. Meus maxilares ficam rígidos, apertados ou cansados com regularidade?", name: "sobreMaxilar" },
    { label: "19. Já usou placa de mordida?", name: "placaMordida" },
    { label: "20. Qual seu grau de tensão e/ou ansiedade no dentista?", name: "grauTensao" }
  ];

  if (loading) return <p>Carregando anamnese...</p>;

  if (!anamnese) {
    return (
      <div className="criarAnamneseContainer">
        <h2>Anamnese</h2>
        <p>Nenhuma anamnese encontrada para este paciente.</p>
        <button onClick={handleCriarAnamnese} className="btnCriarAnamnese">
          Criar Anamnese
        </button>
      </div>
    );
  }

  return (
    <div className="anamneseContainer">
      <div className="anamneseHeader">
        <h2>Histórico Médico e Odontológico</h2>
        <button onClick={() => setEditando(!editando)} className="btnEditarAnamnese">
          {editando ? "Cancelar" : "Editar"}
        </button>
      </div>

      {campos.map(({ label, name, isBool, isArray }) => (
        <div key={name} className="sectionAnamnese">
          <strong>{label}</strong>
          {editando ? (
            isBool ? (
              <select
                name={name}
                value={formData[name] ? "true" : "false"}
                onChange={e => setFormData({ ...formData, [name]: e.target.value === "true" })}
                className="selectAnamnese"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            ) : isArray ? (
              <textarea
                name={name}
                value={Array.isArray(formData[name]) ? formData[name].join("\n") : ""}
                onChange={e => setFormData({ ...formData, [name]: e.target.value.split("\n") })}
                className="textareaAnamnese"
              />
            ) : (
              <input
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="inputAnamnese"
              />
            )
          ) : (
            isBool ? formatBool(anamnese[name]) :
              isArray ? (anamnese[name] ? (
                <ul className="listaCondicoes">
                  {(Array.isArray(anamnese[name])
                    ? anamnese[name]
                    : [anamnese[name]]
                  ).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              ) : <p>Nenhuma condição relatada.</p>) :
                <p>{anamnese[name]}</p>
          )}
        </div>
      ))}

      {editando && (
        <button onClick={handleSalvar} className="btnSalvarAnamnese">
          Salvar
        </button>
      )}
    </div>
  );
}