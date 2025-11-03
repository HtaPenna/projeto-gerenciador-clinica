import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Paciente from './pages/paciente/Paciente.jsx';
import Agendavisual from './pages/agendamento/Agendamento.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Main from './pages/main/Main.jsx';
import Login from './pages/login/Login.jsx';
import CadastroDentista from './pages/cadastro/CadastroDentista.jsx';
import CadastroPaciente from './pages/cadastro/CadastroPaciente.jsx';
import Estoque from './pages/estoque/Estoque.jsx';
import Prontuario from './pages/paciente/Prontuário.jsx';

function App() {
  return (
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro/dentista" element={<CadastroDentista />} />
    <Route path="/cadastro/paciente" element={<CadastroPaciente />} />
    
    <Route path="/main" element={<MainLayout />}>
      <Route index element={<Main />} />
      <Route path="pacientes" element={<Paciente />} />
      <Route path="agenda" element={<Agendavisual />} />
      <Route path="estoque" element={<Estoque />} />
      <Route path="pacientes/:id/prontuario" element={<Prontuario />} />
    </Route>
  </Routes>

  );
}

export default App;
