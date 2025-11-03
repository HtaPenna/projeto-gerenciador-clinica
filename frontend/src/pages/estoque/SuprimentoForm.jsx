// SuprimentoForm.jsx
import React, { useState, useEffect } from "react";

export default function SuprimentoForm({ suprimento = null, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    Codigo_Sup: "",
    Nome_Sup: "",
    Tipo_Sup: "",
    Descricao_Sup: "",
    Quantidade_Sup: "",
    QuantidadeMin_Sup: "",
    id: null, // id da tabela suprimento (null quando novo)
  });

  // Quando o prop 'suprimento' mudar (edição), preenche o form
  useEffect(() => {
    if (suprimento) {
      setForm({
        Codigo_Sup: suprimento.Codigo_Sup ?? "",
        Nome_Sup: suprimento.Nome_Sup ?? "",
        Tipo_Sup: suprimento.Tipo_Sup ?? "",
        Descricao_Sup: suprimento.Descricao_Sup ?? "",
        Quantidade_Sup: suprimento.Quantidade_Sup ?? "",
        QuantidadeMin_Sup: suprimento.QuantidadeMin_Sup ?? "",
        id: suprimento.id ?? null,
      });
    } else {
      // limpa para novo
      setForm({
        Codigo_Sup: "",
        Nome_Sup: "",
        Tipo_Sup: "",
        Descricao_Sup: "",
        Quantidade_Sup: "",
        QuantidadeMin_Sup: "",
        id: null,
      });
    }
  }, [suprimento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.Codigo_Sup || !form.Nome_Sup || !form.Tipo_Sup || !form.Quantidade_Sup) {
      alert("Preencha os campos obrigatórios: Código, Nome, Tipo e Quantidade.");
      return;
    }

    const payload = {
      Codigo_Sup: Number(form.Codigo_Sup),
      Nome_Sup: form.Nome_Sup,
      Tipo_Sup: form.Tipo_Sup,
      Descricao_Sup: form.Descricao_Sup,
      Quantidade_Sup: Number(form.Quantidade_Sup),
      QuantidadeMin_Sup: form.QuantidadeMin_Sup ? Number(form.QuantidadeMin_Sup) : null,
    };

    if (form.id) payload.id = form.id;

    onSalvar(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Código*</label>
        <input type="number" name="Codigo_Sup" value={form.Codigo_Sup} onChange={handleChange} required />
      </div>

      <div>
        <label>Nome*</label>
        <input type="text" name="Nome_Sup" value={form.Nome_Sup} onChange={handleChange} required />
      </div>

      <div>
        <label>Tipo*</label>
        <input type="text" name="Tipo_Sup" value={form.Tipo_Sup} onChange={handleChange} required />
      </div>

      <div>
        <label>Descrição</label>
        <textarea name="Descricao_Sup" value={form.Descricao_Sup} onChange={handleChange} />
      </div>

      <div>
        <label>Quantidade*</label>
        <input type="number" name="Quantidade_Sup" value={form.Quantidade_Sup} onChange={handleChange} required />
      </div>

      <div>
        <label>Quantidade Mínima</label>
        <input type="number" name="QuantidadeMin_Sup" value={form.QuantidadeMin_Sup} onChange={handleChange} />
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit">{form.id ? "Atualizar" : "Salvar"}</button>
        <button type="button" onClick={onCancelar} style={{ marginLeft: 8 }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
