import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CadastroDentista() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [cro, setCro] = useState("");
  const [enderecoConsultorio, setEnderecoConsultorio] = useState("");
  const [telefoneConsultorio, setTelefoneConsultorio] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/dentistas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha,
          nome,
          cro,
          enderecoConsultorio,
          telefoneConsultorio
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem("Cadastro realizado com sucesso!");
        navigate("/login"); // redireciona para login após cadastro
      } else {
        setMensagem(data.erro || "Erro no cadastro");
      }
    } catch (err) {
      setMensagem("Erro no servidor");
    }
  };

  return (
    <div>
      <h2>Cadastro de Dentista</h2>
      <form onSubmit={handleCadastro}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="CRO"
          value={cro}
          onChange={(e) => setCro(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Endereço do consultório"
          value={enderecoConsultorio}
          onChange={(e) => setEnderecoConsultorio(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Telefone do consultório"
          value={telefoneConsultorio}
          onChange={(e) => setTelefoneConsultorio(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
      <p>
        Já tem conta? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
