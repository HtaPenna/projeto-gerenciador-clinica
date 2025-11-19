import { useEffect, useState } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Home, Users, Calendar, ClipboardCheck, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Main.css';

function Main() {
  const { updateTitle } = usePageTitle();
  const [modalRapidoOpen, setModalRapidoOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle('Início');
  }, [updateTitle]);

  const atalhos = [
    { key: 'pacientes', title: 'Pacientes', desc: 'Área do paciente, dados cadastrais e clínicos', route: '/main/pacientes', Icon: Users },
    { key: 'agenda', title: 'Agenda', desc: 'Procedimentos agendados e horários disponíveis', route: '/main/agenda', Icon: Calendar },
    { key: 'consultas', title: 'Consultas', desc: 'Dados das consultas realizadas', route: '/main/consultas', Icon: ClipboardCheck },
    { key: 'estoque', title: 'Estoque', desc: 'Suprimentos utilizados, e níveis do estoque', route: '/main/estoque', Icon: Package },
  ];

  const { isAuthenticated } = useAuth();

  const handleGo = (route) => {
    if (!isAuthenticated()) {
      navigate('/acesso-bloqueado');
      return;
    }
    navigate(route);
  };

  return (
    <div className="mainContent">
      <div className='atalhos'>
        {atalhos.map(({ key, title, desc, route, Icon }) => (
          <div key={key} role="article" className='atalho'>
            <div className='atalhoTitle'>
              <Icon size={30} color='#fff'/>
              <h3>{title}</h3>
            </div>
            <p>{desc}</p>
            <button onClick={() => handleGo(route)}>
              Ir para {title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
