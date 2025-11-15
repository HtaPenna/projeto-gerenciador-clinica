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

  return (
    <div className="homePage">
      <div id="menu">
        <div id='logoNav'>
          <div id="logo"><img src={logo}/></div>
          <div id='nav'>
            <a href="#">Inicio</a>
            <a href="#">Sobre</a>
          </div>
        </div>
        <div id="logar">
          <button onClick={() => setShowLoginModal(true)}>Entrar</button>
        </div>
      </div>
      <div className="homeContent">
        <div id='banner'>
          <div id='textoBanner'>
            <h1>O sistema web que gerencia sua clínica e simplifica sua rotina.</h1>
            <p>Agenda, pacientes, relatórios e estoque em um só lugar — simplifique sua rotina com o Dent.fy e foque no que realmente importa: o atendimento ao paciente.</p>
            <button onClick={() => setShowLoginModal(true)}>Acessar</button>
          </div>
          <div id='imgBanner'>
            <img src={imgBanner}/>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          console.log('Login realizado com sucesso!');
          // O navigate é feito dentro do próprio modal
        }}
      />
    </div>
  );
}

export default Home;