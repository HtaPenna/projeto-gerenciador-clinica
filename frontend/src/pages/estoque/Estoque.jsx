// Estoque.jsx
import React, { useState, useEffect } from "react";
import { usePageTitle } from '../../hooks/usePageTitle';
import SuprimentoForm from "./SuprimentoForm.jsx";

const API_URL = "http://localhost:3001/suprimento";

export default function Estoque() {
  const [suprimentos, setSuprimentos] = useState([]);
  const [suprimentoEditando, setSuprimentoEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateTitle } = usePageTitle();

  // Carrega suprimentos do banco
  const carregarSuprimentos = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setSuprimentos(data);
    } catch (err) {
      console.error("Erro ao carregar suprimentos:", err);
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

  // Criar suprimento (retorna objeto criado)
  const criarSuprimento = async (suprimento) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suprimento),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: "Erro" }));
      throw err;
    }
    const novo = await res.json();
    await carregarSuprimentos();
    return novo;
  };

  // Atualizar suprimento (retorna objeto atualizado)
  const atualizarSuprimento = async (id, suprimento) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(suprimento),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ erro: "Erro" }));
      throw err;
    }
    const atualizado = await res.json();
    await carregarSuprimentos();
    return atualizado;
  };

  // Deletar suprimento
  const deletarSuprimento = async (id) => {
    try {
      const ok = window.confirm("Confirma exclusão deste suprimento?");
      if (!ok) return;
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ erro: "Erro" }));
        throw err;
      }
      await carregarSuprimentos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert(err.erro || "Erro ao deletar suprimento");
    }
  };

  // Quando salvar (criar ou atualizar), aguardamos a operação antes de fechar
  const handleSalvar = async (suprimento) => {
    try {
      if (suprimento.id) {
        await atualizarSuprimento(suprimento.id, suprimento);
        alert("Suprimento atualizado com sucesso!");
      } else {
        await criarSuprimento(suprimento);
        alert("Suprimento criado com sucesso!");
      }
      setMostrarForm(false);
      setSuprimentoEditando(null);
    } catch (err) {
      console.error(err);
      alert(err.erro || err.message || "Erro ao salvar suprimento");
    }
  };

  // Render form (novo ou editar)
  if (mostrarForm || suprimentoEditando) {
    return (
      <div className="estoque-container">
        <h1>{suprimentoEditando ? "Editar Suprimento" : "Novo Suprimento"}</h1>
        <SuprimentoForm
          suprimento={suprimentoEditando || null}
          onSalvar={handleSalvar}
          onCancelar={() => {
            setSuprimentoEditando(null);
            setMostrarForm(false);
          }}
        />
      </div>
    );
  }

  // Lista principal
  return (
    <div className="estoque-lista">
      <h1>Estoque de Suprimentos</h1>

      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => {
            setSuprimentoEditando(null);
            setMostrarForm(true);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Novo Suprimento
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="tabela-suprimentos">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th>Quantidade Mínima</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {suprimentos.length > 0 ? (
              suprimentos.map((s) => (
                <tr key={s.id}>
                  <td>{s.Codigo_Sup}</td>
                  <td>{s.Nome_Sup}</td>
                  <td>{s.Tipo_Sup}</td>
                  <td>{s.Descricao_Sup}</td>
                  <td>{s.Quantidade_Sup}</td>
                  <td>{s.QuantidadeMin_Sup}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSuprimentoEditando(s);
                        setMostrarForm(true);
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletarSuprimento(s.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Nenhum suprimento cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
