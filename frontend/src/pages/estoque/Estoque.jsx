import React, { useState, useEffect } from "react";
import { usePageTitle } from '../../hooks/usePageTitle';
import SuprimentoModal from "../../components/modals/SuprimentoModal/SuprimentoModal.jsx";
import EstoqueTable from "../../components/data-display/EstoqueTable/EstoqueTable.jsx";
import { useAuth } from '../../hooks/useAuth';

const API_URL = "http://localhost:3001/suprimentos";

export default function Estoque() {
  const [suprimentos, setSuprimentos] = useState([]);
  const [suprimentoEditando, setSuprimentoEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateTitle } = usePageTitle();

  const { getAuthHeaders } = useAuth();

  const carregarSuprimentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        setSuprimentos([]);
        setError("Nenhum suprimento cadastrado ainda.");
        return;
      }

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setSuprimentos(data);
    } catch (err) {
      console.error("Erro ao carregar suprimentos:", err);
      setError("Erro ao carregar estoque.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateTitle('Estoque');
  }, [updateTitle]);

  useEffect(() => {
    carregarSuprimentos();
  }, []);

  const deletarSuprimento = async (id) => {
    try {
      const ok = window.confirm("Confirma exclusão deste suprimento?");
      if (!ok) return;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Erro ao deletar");
      await carregarSuprimentos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao deletar suprimento");
    }
  };

  const abrirModalNovo = () => {
    setSuprimentoEditando(null);
    setShowModal(true);
  };

  const abrirModalEditar = (suprimento) => {
    setSuprimentoEditando(suprimento);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setSuprimentoEditando(null);
  };

  return (
    <div className="estoque-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Estoque de Suprimentos</h1>
        <button
          onClick={abrirModalNovo}
          className="btn btn-success"
        >
          + Novo Suprimento
        </button>
      </div>

      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      <EstoqueTable
        suprimentos={suprimentos}
        onEditar={abrirModalEditar}
        onDeletar={deletarSuprimento}
        loading={loading}
      />

      <SuprimentoModal
        isOpen={showModal}
        onClose={fecharModal}
        suprimento={suprimentoEditando}
        onSuccess={carregarSuprimentos}
      />
    </div>
  );
}