import React, { useState, useEffect } from "react";
import SuprimentoForm from "./SuprimentoForm.jsx";

const API_URL = "http://localhost:3001/suprimento";

export default function Estoque() {
  const [suprimentos, setSuprimentos] = useState([]);
  const [suprimentoEditando, setSuprimentoEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  // Carrega suprimentos do banco
  const carregarSuprimentos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSuprimentos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarSuprimentos();
  }, []);

  // Criar suprimento
  const criarSuprimento = async (suprimento) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suprimento),
      });
      const novoSuprimento = await res.json();
      carregarSuprimentos();
      setSuprimentoEditando(novoSuprimento);
    } catch (err) {
      console.error(err);
    }
  };

  // Atualizar suprimento
  const atualizarSuprimento = async (id, suprimento) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suprimento),
      });
      setSuprimentoEditando({ ...suprimentoEditando, ...suprimento });
      carregarSuprimentos();
    } catch (err) {
      console.error(err);
    }
  };

  // Deletar suprimento
  const deletarSuprimento = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      carregarSuprimentos();
    } catch (err) {
      console.error(err);
    }
  };

  // Página de criação/edição do formulário
  if (mostrarForm || suprimentoEditando) {
    return (
      <div className="estoque-container">
        <h1>{suprimentoEditando ? "Editar Suprimento" : "Novo Suprimento"}</h1>
        <SuprimentoForm
          suprimento={suprimentoEditando}
          onSalvar={(suprimento) => {
            if (suprimento.id) {
              atualizarSuprimento(suprimento.id, suprimento);
              alert("Suprimento atualizado com sucesso!");
            } else {
              criarSuprimento(suprimento);
              alert("Suprimento criado com sucesso!");
            }
            setMostrarForm(false);
            setSuprimentoEditando(null);
          }}
          onCancelar={() => {
            setSuprimentoEditando(null);
            setMostrarForm(false);
          }}
        />
      </div>
    );
  }

  // Página principal com lista de suprimentos
  return (
    <div className="estoque-lista">
      <h1>Estoque de Suprimentos</h1>
      <button
        onClick={() => {
          setMostrarForm(true);
          setSuprimentoEditando(null);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Novo Suprimento
      </button>

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
          {suprimentos.map((s) => (
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
          ))}
          {suprimentos.length === 0 && (
            <tr>
              <td colSpan="7">Nenhum suprimento cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
