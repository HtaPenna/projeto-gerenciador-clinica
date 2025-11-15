import { useEffect, useState } from 'react';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import AgendamentoRapidoModal from '../../components/modals/AgendamentoModal/AgendamentoModal.jsx';
import './Main.css';

function Main() {
  const { updateTitle } = usePageTitle();
  const [modalRapidoOpen, setModalRapidoOpen] = useState(false);
  const navigate = useNavigate(); // ✅ adiciona o hook

  useEffect(() => {
    updateTitle('Início');
  }, [updateTitle]);

  return (
    <div id="mainContent" className="text-center mt-8">
      <p className="mb-6 text-gray-700">
        Bem-vindo ao sistema de gerenciamento odontológico.
      </p>

      <div className="flex justify-center gap-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"
          onClick={() => navigate('/main/pacientes/novo')}
        >
          <span>Novo Paciente</span>
        </button>

        <button
          onClick={() => setModalRapidoOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Agendar Consulta
        </button>
      </div>

      {/* Modal de agendamento rápido */}
      <AgendamentoRapidoModal
        isOpen={modalRapidoOpen}
        onRequestClose={() => setModalRapidoOpen(false)}
        onSuccess={() => {
          alert('Agendamento criado com sucesso!');
          setModalRapidoOpen(false);
        }}
        dentistaId={1}
      />
    </div>
  );
}

export default Main;
