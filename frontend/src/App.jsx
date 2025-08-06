import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home.jsx';
import Paciente from './pages/paciente/Paciente.jsx';
import Agendavisual from './pages/agendamento/Agendamento.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Main from './pages/main/Main.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<Main />} /> {/* Rota principal dentro do layout */}
        <Route path="pacientes" element={<Paciente />} />
        <Route path="agenda" element={<Agendavisual />} />
      </Route>
    </Routes>
  );
}

export default App;
