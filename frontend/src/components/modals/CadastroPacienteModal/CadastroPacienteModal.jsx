import React, { useState } from "react";
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';
import PacienteForm from '../../forms/PacienteForm/PacienteForm';
import AnamneseForm from '../../forms/AnamneseForm/AnamneseForm';

const API_CADASTRO_COMPLETO = "http://localhost:3001/pacientes/cadastro-completo";
const API_ANAMNESES = "http://localhost:3001/anamneses";

export default function CadastroPacienteModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const { addToast } = useToast();
  const { getToken, getAuthHeaders } = useAuth();
  const [etapa, setEtapa] = useState('paciente');
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [anamneseEditando, setAnamneseEditando] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const criarPaciente = async (pacienteData) => {
    try {
      setIsSubmitting(true);
      const token = getToken();
      if (!token) {
        addToast("Token não encontrado! Faça login novamente.", "error");
        return;
      }

      const response = await fetch(API_CADASTRO_COMPLETO, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(pacienteData),
      });

      const data = await response.json();

      if (response.ok) {
        setPacienteEditando(data);
        setAnamneseEditando({ pacienteId: data.id });
        setEtapa('anamnese');
        addToast("Paciente cadastrado com sucesso! Agora preencha a anamnese.", "success");
      } else {
        throw new Error(data.erro || data.message || "Erro ao criar paciente");
      }
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      addToast(error.message, "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const salvarAnamnese = async (anamneseData) => {
    try {
      setIsSubmitting(true);
      const method = anamneseData.id ? "PATCH" : "POST";
      const url = anamneseData.id ? `${API_ANAMNESES}/${anamneseData.id}` : API_ANAMNESES;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(anamneseData),
      });

      if (!response.ok) throw new Error('Erro ao salvar anamnese');

      addToast("Cadastro completo realizado com sucesso!", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar anamnese:', error);
      addToast("Erro ao salvar anamnese", "error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFechar = () => {
    setEtapa('paciente');
    setPacienteEditando(null);
    setAnamneseEditando(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleFechar}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {etapa === 'paciente' ? "Cadastrar Novo Paciente" : "Preencher Anamnese"}
            </h5>
            <button type="button" className="btn-close" onClick={handleFechar}></button>
          </div>

          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {etapa === 'paciente' && (
              <PacienteForm
                paciente={pacienteEditando}
                onSalvar={criarPaciente}
                onCancelar={handleFechar}
                hideTitle={true}
                isSubmitting={isSubmitting}
              />
            )}

            {etapa === 'anamnese' && (
              <AnamneseForm
                anamnese={anamneseEditando}
                onSalvar={salvarAnamnese}
                onCancelar={handleFechar}
                hideTitle={true}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}