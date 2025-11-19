import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PacientesList from "../../components/data-display/PacienteTable/PacienteTable.jsx";
import CadastroPacienteModal from '../../components/modals/CadastroPacienteModal/CadastroPacienteModal.jsx';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Search } from "lucide-react";
import "./Paciente.css";

const API_URL = "http://localhost:3001/pacientes";

export default function Paciente() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { updateTitle } = usePageTitle();
  const { getAuthHeaders } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [pacientes, setPacientes] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === "/main/pacientes") {
      setShowModal(false);
      setPacienteEditando(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    updateTitle('Pacientes');
  }, [updateTitle]);

  useEffect(() => {
    if (id === "novo") abrirModalNovoPaciente();
  }, [id]);

  const abrirModalNovoPaciente = () => {
    setPacienteEditando({});
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setPacienteEditando(null);
    navigate("/main/pacientes");
  };

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      if (response.status === 404) {
        setPacientes([]);
        setPacientesFiltrados([]);
        return;
      }

      if (!response.ok)
        throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setPacientes(data);
      setPacientesFiltrados(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        setPacientes([]);
        setPacientesFiltrados([]);
      } else {
        addToast('Erro ao carregar lista de pacientes', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarPacientes(); }, []);

  useEffect(() => {
    if (!busca.trim()) {
      setPacientesFiltrados(pacientes);
      return;
    }

    const filtrados = pacientes.filter(paciente =>
      paciente.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      paciente.telefoneCelular?.includes(busca)
    );
    setPacientesFiltrados(filtrados);
  }, [busca, pacientes]);

  // Verifica se há pacientes cadastrados
  const temPacientesCadastrados = pacientes.length > 0;

  // Verifica se a busca não encontrou resultados
  const buscaSemResultados = busca.trim() !== '' && pacientesFiltrados.length === 0;

  return (
    <div className="pacienteContainer">
      <div className="searchBar mb-4">
        <div className="search-container">
          <input
            type="text"
            placeholder="Procurar paciente por nome ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
          <Search size={18} className="search-icon" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2 text-muted">Carregando pacientes...</p>
        </div>
      ) : (
        <>
          {/* Mensagem quando busca não encontra resultados */}
          {buscaSemResultados && (
            <div className="text-center py-5">
              <p className="text-muted mb-3">Nenhum paciente encontrado para "{busca}"</p>
              <button
                onClick={abrirModalNovoPaciente}
                className="btn btn-outline-primary"
              >
                Cadastrar Novo Paciente
              </button>
            </div>
          )}

          {/* Mensagem quando não há pacientes cadastrados */}
          {!temPacientesCadastrados && !buscaSemResultados && (
            <div className="text-center py-5">
              <p className="text-muted mb-3">Nenhum paciente cadastrado ainda.</p>
              <button
                onClick={abrirModalNovoPaciente}
                className="btn btn-primary"
              >
                Cadastrar Primeiro Paciente
              </button>
            </div>
          )}

          {/* Lista de pacientes quando há resultados */}
          {temPacientesCadastrados && !buscaSemResultados && pacientesFiltrados.length > 0 && (
            <PacientesList
              pacientes={pacientesFiltrados}
              onVerProntuario={(id) => navigate(`/main/pacientes/${id}/prontuario`)}
            />
          )}
        </>
      )}

      {showModal && (
        <CadastroPacienteModal
          isOpen={showModal}
          onClose={fecharModal}
          onSuccess={carregarPacientes}
        />
      )}
    </div>
  );
}