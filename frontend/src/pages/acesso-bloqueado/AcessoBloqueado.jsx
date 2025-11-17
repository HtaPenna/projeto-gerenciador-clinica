import { useNavigate } from 'react-router-dom';
import './AcessoBloqueado.css';
import { useAuth } from '../../hooks/useAuth';

export default function AcessoBloqueado() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="acesso-bloqueado-container">
      <div className="acesso-bloqueado-card">
        <div className="icon">⏳</div>
        <h2>Acesso Temporariamente Indisponível</h2>
        <p>Estamos preparando sua área personalizada.</p>
        <p>Para agendamentos, entre em contato com a clínica.</p>
        <button
          className="btn btn-primary mt-3"
          onClick={handleLogout}
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}