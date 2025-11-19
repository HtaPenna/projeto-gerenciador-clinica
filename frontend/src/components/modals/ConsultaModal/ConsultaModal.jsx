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
      className="modal-dialog"
      overlayClassName="modal-backdrop show"
    >
      <div className="modal-content p-3">
        <div className="modal-header">
          <h5 className="modal-title">Descrição da Consulta</h5>
          <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
        </div>

        <div className="modal-body">
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
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSalvar}>
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}