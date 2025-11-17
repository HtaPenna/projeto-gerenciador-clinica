import React from 'react';
import SuprimentoForm from '../../forms/SuprimentoForm/SuprimentoForm';
import { useAuth } from '../../../hooks/useAuth';

const API_URL = "http://localhost:3001/suprimentos";

export default function SuprimentoModal({
  isOpen,
  onClose,
  suprimento,
  onSuccess
}) {

  const { getAuthHeaders } = useAuth();

  const criarSuprimento = async (suprimentoData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(suprimentoData),
    });
    if (!res.ok) throw new Error("Erro ao criar suprimento");
    return await res.json();
  };

  const atualizarSuprimento = async (id, suprimentoData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(suprimentoData),
    });
    if (!res.ok) throw new Error("Erro ao atualizar suprimento");
    return await res.json();
  };

  const handleSalvar = async (suprimentoData) => {
    try {
      if (suprimentoData.id) {
        await atualizarSuprimento(suprimentoData.id, suprimentoData);
        alert("Suprimento atualizado com sucesso!");
      } else {
        await criarSuprimento(suprimentoData);
        alert("Suprimento criado com sucesso!");
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message || "Erro ao salvar suprimento");
      throw error;
    }
  };

  const handleCancelar = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {suprimento?.id ? "Editar Suprimento" : "Novo Suprimento"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <SuprimentoForm
              suprimento={suprimento}
              onSalvar={handleSalvar}
              onCancelar={handleCancelar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}