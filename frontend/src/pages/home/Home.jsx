import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="homePage">
      <div id="menu">
        <div id="logo">Logo</div>
        <div id="nav">
          <button onClick={() => navigate('/login')}>Entrar</button>
        </div>
      </div>
      <div className="homeContent">
        <h1>COM VOCÊ, PARA VOCÊ</h1>
        <p>
          CONTROLE SUA AGENDA COM UM TOQUE, TENHA UM GERENCIAMENTO DE SUPRIMENTOS AUTOMATIZADO COM OS TRATAMENTOS
        </p>
      </div>
    </div>
  );
}

export default Home;