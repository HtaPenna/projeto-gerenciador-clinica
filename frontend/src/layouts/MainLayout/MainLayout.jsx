import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import './MainLayout.css';
import FloatingActions from "../FloatingActions/FloatingActions.jsx";
import { useAuth } from '../../hooks/useAuth';
import GerenciamentoContaModal from '../../components/modals/GerenciamentoContaModal/GerenciamentoContaModal.jsx';

function MainLayout() {
  const [user, setUser] = useState(null);
  const [showGerenciamentoModal, setShowGerenciamentoModal] = useState(false);
  const navigate = useNavigate();
  const { getUser, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const authCheck = isAuthenticated();
    if (!authCheck) {
      navigate('/', {
        state: {
          showLoginModal: true,
          redirectTo: location.pathname
        }
      });
      return;
    }

    const userData = getUser();
    setUser(userData);

    if (userData?.tipo === 'paciente') {
      navigate('/acesso-bloqueado');
      return;
    }
  }, [navigate, isAuthenticated, getUser, location.pathname]);

  if (!user) {
    return (
      <div className="loading">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="appLayout">
      <FloatingActions />
      <Navbar />
      <Header onOpenGerenciamento={() => setShowGerenciamentoModal(true)} />
      <div className="content">
        <Outlet />
      </div>
      <GerenciamentoContaModal
        isOpen={showGerenciamentoModal}
        onClose={() => setShowGerenciamentoModal(false)}
      />
    </div>
  );
}

export default MainLayout;