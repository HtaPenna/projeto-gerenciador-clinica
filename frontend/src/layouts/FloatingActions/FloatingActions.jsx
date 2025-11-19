import { useState, useRef, useEffect } from "react";
import { Plus, User, Calendar, Package } from "lucide-react";
import AgendamentoModal from "../../components/modals/AgendamentoModal/AgendamentoModal.jsx";
import CadastroPacienteModal from "../../components/modals/CadastroPacienteModal/CadastroPacienteModal.jsx";
import SuprimentoModal from "../../components/modals/SuprimentoModal/SuprimentoModal.jsx";
import "./FloatingActions.css";

export default function FloatingActions() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalPacienteOpen, setModalPacienteOpen] = useState(false);
  const [modalAgendamentoOpen, setModalAgendamentoOpen] = useState(false);
  const [modalSuprimentoOpen, setModalSuprimentoOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          <Plus size={30} />
        </button>

        {dropdownOpen && (
          <div className="newDropContainer">
            <button
              className="dropdown-option"
              onClick={() => {
                setModalPacienteOpen(true);
                setDropdownOpen(false);
              }}
            >
              <User size={16} />
              <span>Novo Paciente</span>
            </button>

            <button
              className="dropdown-option"
              onClick={() => {
                setModalAgendamentoOpen(true);
                setDropdownOpen(false);
              }}
            >
              <Calendar size={16} />
              <span>Nova Consulta</span>
            </button>

            <button
              className="dropdown-option"
              onClick={() => {
                setModalSuprimentoOpen(true);
                setDropdownOpen(false);
              }}
            >
              <Package size={16} />
              <span>Novo Suprimento</span>
            </button>
          </div>
        )}
      </div>

      <CadastroPacienteModal
        isOpen={modalPacienteOpen}
        onClose={() => setModalPacienteOpen(false)}
        onSuccess={() => setModalPacienteOpen(false)}
      />

      <AgendamentoModal
        isOpen={modalAgendamentoOpen}
        onClose={() => setModalAgendamentoOpen(false)}
        onSuccess={() => setModalAgendamentoOpen(false)}
        dentistaId={1}
      />

      <SuprimentoModal
        isOpen={modalSuprimentoOpen}
        onClose={() => setModalSuprimentoOpen(false)}
        onSuccess={() => setModalSuprimentoOpen(false)}
      />
    </>
  );
}