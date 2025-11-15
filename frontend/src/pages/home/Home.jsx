import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png";
import imgBanner from "../../assets/images/imgBanner.png";
import LoginModal from "../../components/modals/LoginModal/LoginModal.jsx";
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (location.state?.showLoginModal) {
      setShowLoginModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Função para rolagem suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="homePage">
      <div id="menu">
        <div id='logoNav'>
          <div id="logo"><img src={logo} alt="Dent.fy Logo" /></div>
          <div id='nav'>
            <button onClick={() => scrollToSection('banner')}>Inicio</button>
            <button onClick={() => scrollToSection('sobre')}>Sobre</button>
          </div>
        </div>
        <div id="logar">
          <button onClick={() => setShowLoginModal(true)}>Entrar</button>
        </div>
      </div>

      <div className="homeContent">
        {/* Seção Banner (já existente) */}
        <div id='banner'>
          <div id='textoBanner'>
            <h1>O sistema web que gerencia sua clínica e simplifica sua rotina.</h1>
            <p>Agenda, pacientes, relatórios e estoque em um só lugar — simplifique sua rotina com o Dent.fy e foque no que realmente importa: o atendimento ao paciente.</p>
            <button onClick={() => setShowLoginModal(true)}>Acessar</button>
          </div>
          <div id='imgBanner'>
            <img src={imgBanner} alt="Interface do sistema Dent.fy" />
          </div>
        </div>

        {/* Nova Seção Sobre */}
        <div id='sobre'>
          <div className='sobre-content'>
            <div className='sobre-texto'>
              <h2>Sobre o Dent.fy</h2>
              <p>O Dent.fy nasceu da necessidade de simplificar a gestão odontológica, unindo tecnologia e praticidade para transformar a administração de clínicas.</p>
              <p>Nossa missão é proporcionar uma experiência intuitiva e eficiente, permitindo que dentistas foquem no que realmente importa: o cuidado com seus pacientes.</p>
            </div>
            <div className='sobre-destaques'>
              <div className='destaque-item'>
                <h3>🎯 Simplicidade</h3>
                <p>Interface intuitiva para uso imediato</p>
              </div>
              <div className='destaque-item'>
                <h3>⚡ Eficiência</h3>
                <p>Automatize tarefas repetitivas</p>
              </div>
              <div className='destaque-item'>
                <h3>📊 Controle</h3>
                <p>Tenha insights sobre sua clínica</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          console.log('Login realizado com sucesso!');
        }}
      />
    </div>
  );
}

export default Home;