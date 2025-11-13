import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ importar Link
import {CircleArrowLeft} from "lucide-react";
import API_BASE_URL from "../../apiConfig";
import './login.css'

export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const API_BASE = `${API_BASE_URL}`;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name); 
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
    <div className="loginPage">
      <div className="btnVoltar">
        <button onClick={() => navigate('/')}><CircleArrowLeft size={26}/></button>
      </div>
      <div className="containerLogin">
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

        <div className="textoRodape">
          <p>
            Não tem uma conta? Cadastre-se como:
          </p>
          <div className="linksCadastro">
            <Link to="/cadastro/dentista">
              Dentista
            </Link>
            <Link to="/cadastro/paciente">
              Paciente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
