import React, { useState, useEffect } from "react";
import { usePageTitle } from '../../hooks/usePageTitle';
import SuprimentoModal from "../../components/modals/SuprimentoModal/SuprimentoModal.jsx";
import EstoqueTable from "../../components/data-display/EstoqueTable/EstoqueTable.jsx";
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Search } from "lucide-react";
import './Estoque.css';

const API_URL = "http://localhost:3001/suprimentos";

export default function Estoque() {
  const [suprimentos, setSuprimentos] = useState([]);
  const [suprimentosFiltrados, setSuprimentosFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [suprimentoEditando, setSuprimentoEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateTitle } = usePageTitle();
  const { getAuthHeaders } = useAuth();
  const { addToast } = useToast();

  const carregarSuprimentos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        setSuprimentos([]);
        setSuprimentosFiltrados([]);
        setError("Nenhum suprimento cadastrado ainda.");
        return;
      }

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const data = await res.json();
      setSuprimentos(data);
      setSuprimentosFiltrados(data);
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

  useEffect(() => {
    if (!busca.trim()) {
      setSuprimentosFiltrados(suprimentos);
      return;
    }

    const filtrados = suprimentos.filter(suprimento =>
      suprimento.Nome_Sup?.toLowerCase().includes(busca.toLowerCase()) ||
      suprimento.Codigo_Sup?.toString().includes(busca) ||
      suprimento.Tipo_Sup?.toLowerCase().includes(busca.toLowerCase())
    );
    setSuprimentosFiltrados(filtrados);
  }, [busca, suprimentos]);

  const deletarSuprimento = async (id) => {
    try {
      const ok = window.confirm("Confirma exclusão deste suprimento?");
      if (!ok) return;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Erro ao deletar");

      addToast("Suprimento excluído com sucesso!", "success");
      await carregarSuprimentos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      addToast("Erro ao excluir suprimento", "error");
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

  const temSuprimentosCadastrados = suprimentos.length > 0;
  const buscaSemResultados = busca.trim() !== '' && suprimentosFiltrados.length === 0;

  return (
    <div className="estoqueContainer">
      <div className="searchBar mb-4">
        <div className="search-container">
          <input
            type="text"
            placeholder="Procurar suprimento por nome, código ou tipo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
          <Search size={18} className="search-icon" />
        </div>
      </div>

      {error && !buscaSemResultados && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}

      {buscaSemResultados && (
        <div className="text-center py-5">
          <p className="text-muted mb-3">Nenhum suprimento encontrado para "{busca}"</p>
          <button
            onClick={abrirModalNovo}
            className="btn btn-outline-primary"
          >
            Cadastrar Novo Suprimento
          </button>
        </div>
      )}

      {!temSuprimentosCadastrados && !buscaSemResultados && (
        <div className="text-center py-5">
          <p className="text-muted mb-3">Nenhum suprimento cadastrado ainda.</p>
          <button
            onClick={abrirModalNovo}
            className="btn btn-primary"
          >
            Cadastrar Primeiro Suprimento
          </button>
        </div>
      )}

      {temSuprimentosCadastrados && !buscaSemResultados && suprimentosFiltrados.length > 0 && (
        <EstoqueTable
          suprimentos={suprimentosFiltrados}
          onEditar={abrirModalEditar}
          onDeletar={deletarSuprimento}
          loading={loading}
        />
      )}

      <SuprimentoModal
        isOpen={showModal}
        onClose={fecharModal}
        suprimento={suprimentoEditando}
        onSuccess={carregarSuprimentos}
      />
    </div>
  );
}