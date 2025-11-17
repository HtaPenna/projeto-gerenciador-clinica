import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ConsultaForm from "../../forms/ConsultaForm/ConsultaForm.jsx";

Modal.setAppElement("#root");

export default function ConsultaModal({ 
  isOpen, 
  onClose, 
  consulta,
  onSalvar 
}) {
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamentoRealizado, setTratamentoRealizado] = useState("");
  const [procedimentoRealizado, setProcedimentoRealizado] = useState("");
  const [observacoesClinicas, setObservacoesClinicas] = useState("");
  const [recomendacoes, setRecomendacoes] = useState("");
  const [anexos, setAnexos] = useState([]);

  // Quando a consulta muda ou o modal abre, parseia a descrição
  useEffect(() => {
    if (consulta) {
      const texto = consulta.descricao || "";

      const regex =
        /Diagnóstico:\s*([\s\S]*?)\n\nTratamento Realizado:\s*([\s\S]*?)\n\nProcedimento Realizado:\s*([\s\S]*?)\n\nObservações Clínicas:\s*([\s\S]*?)\n\nRecomendações Pós-Atendimento:\s*([\s\S]*)/;
      const match = texto.match(regex);

      if (match) {
        setDiagnostico(match[1].trim());
        setTratamentoRealizado(match[2].trim());
        setProcedimentoRealizado(match[3].trim());
        setObservacoesClinicas(match[4].trim());
        setRecomendacoes(match[5].trim());
      } else {
        const partes = texto.split("\n\n");
        setDiagnostico(partes[0] || "");
        setTratamentoRealizado(partes[1] || "");
        setProcedimentoRealizado(partes[2] || "");
        setObservacoesClinicas(partes[3] || "");
        setRecomendacoes(partes[4] || "");
      }

      setAnexos([]); // limpa anexos ao abrir
    }
  }, [consulta]);

  const handleSalvar = () => {
    const descricaoFinal = `
Diagnóstico:
${diagnostico.trim()}

Tratamento Realizado:
${tratamentoRealizado.trim()}

Procedimento Realizado:
${procedimentoRealizado.trim()}

Observações Clínicas:
${observacoesClinicas.trim()}

Recomendações Pós-Atendimento:
${recomendacoes.trim()}
    `.trim();

    onSalvar(descricaoFinal, anexos);
  };

  const handleAnexosChange = (e) => {
    const files = Array.from(e.target.files);
    setAnexos(files);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Descrição da Consulta"
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "35rem",
          maxHeight: "90vh",
          overflowY: "auto",
        },
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
      }}
    >
      <h2 className="text-lg font-bold mb-3">Descrição da Consulta</h2>

      <ConsultaForm
        diagnostico={diagnostico}
        onDiagnosticoChange={setDiagnostico}
        tratamentoRealizado={tratamentoRealizado}
        onTratamentoChange={setTratamentoRealizado}
        procedimentoRealizado={procedimentoRealizado}
        onProcedimentoChange={setProcedimentoRealizado}
        observacoesClinicas={observacoesClinicas}
        onObservacoesChange={setObservacoesClinicas}
        recomendacoes={recomendacoes}
        onRecomendacoesChange={setRecomendacoes}
        anexos={anexos}
        onAnexosChange={handleAnexosChange}
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancelar
        </button>
        <button
          onClick={handleSalvar}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}