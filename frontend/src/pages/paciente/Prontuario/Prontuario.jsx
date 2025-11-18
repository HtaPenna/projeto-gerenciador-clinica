import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import VisaoGeral from "./VisaoGeral/VisaoGeral.jsx";
import Anamnese from "./Anamnese/Anamnese.jsx";
import Consultas from "./Consulta/Consulta.jsx";
import Tratamentos from "./Tratamento/Tratamento.jsx";
import { useAuth } from '../../../hooks/useAuth';
import { ChevronLeft } from "lucide-react";
import "./Prontuario.css";

const API_PACIENTES = "http://localhost:3001/pacientes";

export default function Prontuario() {
  const { id: pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [secaoAtiva, setSecaoAtiva] = useState("visaoGeral");
  const [loading, setLoading] = useState(true);
  const [temAnamnese, setTemAnamnese] = useState(null);
  const [showModalEducativo, setShowModalEducativo] = useState(false);
  const { getAuthHeaders } = useAuth();

  const carregarPaciente = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_PACIENTES}/${pacienteId}`, {
        headers: getAuthHeaders()
      });

      if (res.status === 404) {
        alert("Paciente não encontrado");
        navigate("/main/pacientes");
        return;
      }

      if (!res.ok) throw new Error("Erro ao carregar paciente");

      const data = await res.json();
      setPaciente(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar paciente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPaciente();
  }, [pacienteId]);

  useEffect(() => {
    const verificarAnamnese = async () => {
      try {
        const res = await fetch(`http://localhost:3001/anamneses/paciente/${pacienteId}`, {
          headers: getAuthHeaders()
        });

        if (res.status === 404) {
          setTemAnamnese(false);
          setShowModalEducativo(true);
          return;
        } else if (res.ok) {
          const anamneseData = await res.json();
          const preenchida = anamneseData.queixaPrincipal?.trim() !== "" ||
            anamneseData.condicoesSaude?.length > 0;
          setTemAnamnese(preenchida);
        }
      } catch (error) {
        if(!error.message.includes('404')) {
          console.error('Erro ao verificar anamnese:', error);
        }
        setTemAnamnese(false);
      }
    };

    if (pacienteId) {
      verificarAnamnese();
    }
  }, [pacienteId]);

  const excluirPaciente = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este paciente?")) return;

    try {
      const response = await fetch(`${API_PACIENTES}/${pacienteId}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Erro ao excluir paciente');

      alert("Paciente excluído com sucesso!");
      navigate("/main/pacientes");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir paciente");
    }
  };

  if (loading) return <p>Carregando paciente...</p>;
  if (!paciente) return <p>Paciente não encontrado.</p>;

  return (
    <div className="prontuarioContent">
      <div className="divVoltar">
        <button onClick={() => navigate("/main/pacientes")}>< ChevronLeft  size={18}/>Voltar</button>
        <h3>Prontuário</h3>
      </div>

      <div className="divCabecalho">
        <h1 className="nomePaciente">
          {paciente.nome}
          {temAnamnese === false && (
            <span className="warningPendente">
              Anamnese Pendente
            </span>
          )}
        </h1>
        <div className="divInfo">
          <p>Telefone: {paciente.telefoneCelular}</p>
          {paciente.email && <p>Email: {paciente.email}</p>}
          {paciente.dataNascimento && <p>Data de Nascimento: {paciente.dataNascimento}</p>}
          {paciente.cpf && <p>CPF: {paciente.cpf}</p>}
        </div>

        <div className="divNavInterno">
          <button
            className={`${secaoAtiva === "visaoGeral" ? "btnAtivo" : "btnInativo"}`}
            onClick={() => setSecaoAtiva("visaoGeral")}
          >
            Visão Geral
          </button>
          <button
            className={`${secaoAtiva === "tratamentos" ? "btnAtivo" : "btnInativo"}`}
            onClick={() => setSecaoAtiva("tratamentos")}
          >
            Tratamentos
          </button>
          <button
            className={`${secaoAtiva === "anamnese" ? "btnAtivo" : "btnInativo"}`}
            onClick={() => setSecaoAtiva("anamnese")}
          >
            Anamnese
          </button>
          <button
            className={`${secaoAtiva === "consultas" ? "btnAtivo" : "btnInativo"}`}
            onClick={() => setSecaoAtiva("consultas")}
          >
            Consultas
          </button>
        </div>
      </div>

      <div className="containerSecoes">
        {secaoAtiva === "visaoGeral" && <VisaoGeral pacienteId={pacienteId} />}
        {secaoAtiva === "anamnese" && <Anamnese pacienteId={pacienteId} />}
        {secaoAtiva === "tratamentos" && <Tratamentos pacienteId={pacienteId} />}
        {secaoAtiva === "consultas" && <Consultas pacienteId={pacienteId} />}
      </div>

      {showModalEducativo && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <span className="me-2">📝</span>
                  Anamnese Pendente
                </h5>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Recomendamos preencher a anamnese</strong> para ter um histórico completo do paciente
                  e liberar a criação de tratamentos e procedimentos.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => {
                    setSecaoAtiva("anamnese");
                    setShowModalEducativo(false);
                  }}
                  className="btn btn-primary"
                >
                  Preencher Agora
                </button>
                <button
                  onClick={() => setShowModalEducativo(false)}
                  className="btn btn-secondary"
                >
                  Mais Tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="divExcluirPaciente">
        <button onClick={excluirPaciente} >Excluir Paciente</button>
      </div>
    </div>
  );
}