import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Home from './pages/home/Home.jsx';
import Paciente from './pages/paciente/Paciente.jsx';
import PacienteForm from './components/forms/PacienteForm/PacienteForm.jsx';
import Agendavisual from './pages/agendamento/Agendamento.jsx';
import MainLayout from './layouts/MainLayout/MainLayout.jsx';
import Main from './pages/main/Main.jsx';
import CadastroDentista from './pages/cadastro/CadastroDentista.jsx';
import Estoque from './pages/estoque/Estoque.jsx';
import Prontuario from './pages/paciente/Prontuario/Prontuario.jsx';
import HistoricoConsultas from './pages/consulta/ConsultasGerais.jsx';
import AcessoBloqueado from './pages/acesso-bloqueado/AcessoBloqueado.jsx';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro/dentista" element={<CadastroDentista />} />
        
        <Route path="/acesso-bloqueado" element={<AcessoBloqueado />} />

        <Route path="/main" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="pacientes" element={<Paciente />} />
          <Route path="pacientes/:id" element={<Paciente />} />
          <Route path="agenda" element={<Agendavisual />} />
          <Route path="consultas" element={<HistoricoConsultas />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="pacientes/:id/prontuario" element={<Prontuario />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
