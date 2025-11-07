import { useState, useRef, useEffect } from "react";
import { Plus, User, Calendar, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalAgendamentoRapido from "./ModalAgendamento.jsx";
import PacienteForm from "../../pages/paciente/PacienteForm.jsx"; // importe corretamente
import "./FloatingActions.css";

export default function FloatingActions() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalAgendamentoOpen, setModalAgendamentoOpen] = useState(false);
  const [abrirPacienteForm, setAbrirPacienteForm] = useState(false); // novo estado
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="fab-container" ref={dropdownRef}>
        <button 
          className="btnNew" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Plus size={30}/>
        </button>

        {dropdownOpen && (
          <div className="newDropContainer">
            <button 
            className="dropdown-option" 
            onClick={() => {
                navigate("/main/pacientes/novo"); // rota de criação do paciente
                setDropdownOpen(false);
            }}
            >
            <User size={16} />
            <span>Novo paciente</span>
            </button>


            <button 
              className="dropdown-option"
              onClick={() => {
                setModalAgendamentoOpen(true);
                setDropdownOpen(false);
              }}
            >
              <Calendar size={16} />
              <span>Nova consulta</span>
            </button>

            <button className="dropdown-option">
              <Package size={16} />
              <span>Novo relatório</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de agendamento rápido */}
      <ModalAgendamentoRapido
        isOpen={modalAgendamentoOpen}
        onRequestClose={() => setModalAgendamentoOpen(false)}
        onSuccess={() => {
          alert("Consulta agendada com sucesso!");
          setModalAgendamentoOpen(false);
        }}
        dentistaId={1}
      />

      {/* Modal do PacienteForm */}
      {abrirPacienteForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Novo Paciente</h2>
            <PacienteForm
              paciente={{}}
              onSalvar={(paciente) => {
                alert("Paciente criado com sucesso!");
                setAbrirPacienteForm(false);
              }}
              onCancelar={() => setAbrirPacienteForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
