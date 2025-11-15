import { useState } from "react";
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, Link } from "react-router-dom";
import { CircleArrowLeft, X } from "lucide-react";
import './LoginModal.css'

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setAuth(data.token, data.user);
        setMensagem("Login realizado com sucesso!");
        onLoginSuccess?.();
        onClose();
        navigate("/main");
      } else {
        setMensagem(data.message || "Erro no login");
      }
    } catch (err) {
      setMensagem("Erro no servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <button className="btn-close-modal" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="login-modal-content">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          {mensagem && <p className="login-message">{mensagem}</p>}

          <div className="login-modal-footer">
            <p>Não tem uma conta? Cadastre-se como:</p>
            <div className="links-cadastro">
              <Link to="/cadastro/dentista" onClick={onClose}>
                Dentista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}