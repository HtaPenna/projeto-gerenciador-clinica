import { Routes, Route } from 'react-router-dom';
//import Home from './pages/Home';
import Paciente from './pages/paciente/Paciente.jsx';
import AgendaVisual from './pages/agendamento/Agendamento.jsx';
import MainLayout from "./layouts/MainLayout.jsx";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/paciente" element={<Paciente />} />
        <Route path="/agenda" element={<AgendaVisual />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
