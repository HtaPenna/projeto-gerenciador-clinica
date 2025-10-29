import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png";
import imgBanner from "../../assets/images/imgBanner.png";
import './Home.css';

function Home() {
  const navigate = useNavigate();

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
          <button onClick={() => navigate('/login')}>Entrar</button>
        </div>
      </div>
      <div className="homeContent">
        <div id='banner'>
          <div id='textoBanner'>
            <h1>O sistema web que gerencia sua clínica e simplifica sua rotina.</h1>
            <p>Agenda, pacientes, relatórios e estoque em um só lugar — simplifique sua rotina com o Dent.fy e foque no que realmente importa: o atendimento ao paciente.</p>
            <button>Acessar</button>
          </div>
          <div id='imgBanner'>
            <img src={imgBanner}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;