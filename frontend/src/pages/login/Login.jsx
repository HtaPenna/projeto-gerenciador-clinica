import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ importar Link

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMensagem("Login realizado com sucesso!");
        navigate("/main"); 
      } else {
        setMensagem(data.message || "Erro no login");
      }
    } catch (err) {
      setMensagem("Erro no servidor");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Entrar</button> 
      </form>
      {mensagem && <p>{mensagem}</p>}

      <div style={{ marginTop: "20px" }}>
        <p>
          Não tem uma conta? Cadastre-se como:
        </p>
        <Link to="/cadastro/dentista">
          Dentista
        </Link>
        <Link to="/cadastro/paciente">
          Paciente
        </Link>
      </div>
    </div>
  );
}
