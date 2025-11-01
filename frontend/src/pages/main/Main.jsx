import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import './Main.css';

function Main() {
  const { updateTitle } = usePageTitle();

  useEffect(() => {
    updateTitle('Início');
  }, [updateTitle]);

  return (
    <div id="mainContent">
      <h1>Página Principal</h1>
      <p>Conteúdo inicial do sistema</p>
    </div>
  );
}

export default Main;