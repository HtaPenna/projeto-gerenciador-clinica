import { useState, useEffect } from "react";

export default function CadastroSuprimentoForm({ suprimentoId = null }) {
  const [mensagem, setMensagem] = useState("");
  const [suprimento, setSuprimento] = useState({
    Codigo_Sup: "",
    Nome_Sup: "",
    Tipo_Sup: "",
    Descricao_Sup: "",
    Quantidade_Sup: "",
    QuantidadeMin_Sup: "",
  });

  // Carregar suprimento existente para edição
  useEffect(() => {
    if (suprimentoId) {
      fetch(`http://localhost:3001/suprimento/${suprimentoId}`)
        .then((res) => res.json())
        .then((data) => setSuprimento(data))
        .catch((err) => console.error(err));
    }
  }, [suprimentoId]);

  // Atualiza os campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuprimento((prev) => ({ ...prev, [name]: value }));
  };

  // Salvar ou atualizar suprimento
  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const method = suprimento.id ? "PATCH" : "POST";
      const url = suprimento.id
        ? `http://localhost:3001/suprimento/${suprimento.id}`
        : "http://localhost:3001/suprimento";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suprimento),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem("Suprimento salvo com sucesso!");
        // Limpar formulário se for novo
        if (!suprimento.id) {
          setSuprimento({
            Codigo_Sup: "",
            Nome_Sup: "",
            Tipo_Sup: "",
            Descricao_Sup: "",
            Quantidade_Sup: "",
            QuantidadeMin_Sup: "",
          });
        }
      } else {
        setMensagem(data.erro || "Erro ao salvar suprimento");
      }
    } catch (err) {
      console.error(err);
      setMensagem("Erro no servidor");
    }
  };

  return (
    <div>
      <h2>{suprimento.id ? "Editar Suprimento" : "Cadastro de Suprimento"}</h2>

      <form onSubmit={handleSalvar}>
        <input
          type="number"
          name="Codigo_Sup"
          placeholder="Código do Suprimento"
          value={suprimento.Codigo_Sup}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Nome_Sup"
          placeholder="Nome do Suprimento"
          value={suprimento.Nome_Sup}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Tipo_Sup"
          placeholder="Tipo do Suprimento"
          value={suprimento.Tipo_Sup}
          onChange={handleChange}
          required
        />
        <textarea
          name="Descricao_Sup"
          placeholder="Descrição"
          value={suprimento.Descricao_Sup}
          onChange={handleChange}
        />
        <input
          type="number"
          name="Quantidade_Sup"
          placeholder="Quantidade"
          value={suprimento.Quantidade_Sup}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="QuantidadeMin_Sup"
          placeholder="Quantidade Mínima"
          value={suprimento.QuantidadeMin_Sup}
          onChange={handleChange}
        />

        <button type="submit">{suprimento.id ? "Atualizar" : "Salvar"}</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
