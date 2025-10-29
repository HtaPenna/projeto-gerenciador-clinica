import React, { useState, useEffect } from "react";

const API_ANAMNESE = "http://localhost:3001/anamnese/paciente";

export default function Anamnese({ pacienteId }) {
  const [anamnese, setAnamnese] = useState(null);

  const carregarAnamnese = async () => {
    try {
      const res = await fetch(`${API_ANAMNESE}/${pacienteId}`);
      if (res.status === 404) {
        setAnamnese(null);
      } else {
        const data = await res.json();
        setAnamnese(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarAnamnese();
  }, [pacienteId]);

  if (!anamnese) return <p>Anamnese não encontrada.</p>;

  const formatBool = (value) => (value ? "Sim" : "Não");

  return (
    <div className="anamnese-container space-y-4">
      <h2 className="text-xl font-semibold mb-2">Histórico Médico e Odontológico</h2>

      {/* Queixa Principal */}
      <div className="section p-2 bg-white shadow rounded">
        <p><strong>1. Motivo pelo qual procurou tratamento?</strong></p>
        <p>{anamnese.queixaPrincipal}</p>
      </div>

      {/* Condições de Saúde */}
      <div className="section p-2 bg-white shadow rounded">
        <p><strong>2. Já sofreu ou sofre de:</strong></p>
        {anamnese.condicoesSaude.length > 0 ? (
          <ul className="list-disc list-inside">
            {anamnese.condicoesSaude.map((cond, i) => (
              <li key={i}>{cond}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma condição relatada.</p>
        )}
      </div>

      {/* Antecedentes Médicos */}
      <div className="section p-2 bg-white shadow rounded">
        <p><strong>3. Está em algum tratamento médico?</strong></p>
        <p>{anamnese.antecedentesMedicos}</p>

        <p><strong>4. Está tomando alguma medicação?</strong></p>
        <p>{anamnese.usoMedicamentos}</p>

        <p><strong>5. Tem alergia a alguma medicação?</strong></p>
        <p>{anamnese.alergias}</p>

        <p><strong>6. Tem problema de cicatrização?</strong></p>
        <p>{anamnese.sobreCicatrizacao}</p>

        <p><strong>7. Fuma?</strong></p>
        <p>{formatBool(anamnese.fumante)}</p>

        <p><strong>8. Ingere bebida alcoólica?</strong></p>
        <p>{formatBool(anamnese.consumoBebidasAlcoolicas)}</p>

        <p><strong>9. Tem alguma dificuldade de respiração ou obstrução de vias aéreas?</strong></p>
        <p>{formatBool(anamnese.dificuldadeRespiratoria)}</p>

        <p><strong>10. Tem ou teve problema digestivo? (Ex.: intolerância, refluxo...)</strong></p>
        <p>{anamnese.problemaDigestivo}</p>

        <p><strong>11. Quando foi seu último tratamento odontológico?</strong></p>
        <p>{anamnese.ultimoTratamento}</p>
      </div>

      {/* Satisfação e Estética Dental */}
      <div className="section p-2 bg-white shadow rounded">
        <p><strong>12. Está insatisfeito com o seu sorriso?</strong></p>
        <p>{formatBool(anamnese.satisfacaoSorriso)}</p>

        <p><strong>13. Gostaria de ter dentes mais brancos?</strong></p>
        <p>{formatBool(anamnese.dentesBrancos)}</p>

        <p><strong>14. Sente dor ou sensibilidade em algum dente?</strong></p>
        <p>{anamnese.sensibilidadeDentes}</p>

        <p><strong>15. Quando usa fio dental prende ou desfia em algum lugar?</strong></p>
        <p>{anamnese.usoFioDental}</p>

        <p><strong>16. Recebeu orientação de higiene bucal?</strong></p>
        <p>{anamnese.orientacaoBucal}</p>

        <p><strong>17. Tem dificuldade, dor ou ambor ao abrir a boca ou ao bocejar?</strong></p>
        <p>{anamnese.desconfortoBucal}</p>

        <p><strong>18. Meus maxilares ficam rígidos, apertados ou cansados com regularidade?</strong></p>
        <p>{anamnese.sobreMaxilar}</p>

        <p><strong>19. Já usou placa de mordida?</strong></p>
        <p>{anamnese.placaMordida}</p>

        <p><strong>20. Qual seu grau de tensão e/ou ansiedade no dentista?</strong></p>
        <p>{anamnese.grauTensao}</p>
      </div>
    </div>
  );
}
