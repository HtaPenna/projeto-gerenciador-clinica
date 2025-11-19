import React, { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAuth } from '../../hooks/useAuth';
import ConsultaModal from "../../components/modals/ConsultaModal/ConsultaModal.jsx";
import ConsultaTable from "../../components/data-display/ConsultaTable/ConsultaTable.jsx";

const API_URL = "http://localhost:3001/eventos";

import './ConsultasGerais.css';

export default function HistoricoConsultas() {
  const { updateTitle } = usePageTitle();
  const [eventos, setEventos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    updateTitle("Histórico de Consultas");
  }, [updateTitle]);

  const { getAuthHeaders } = useAuth();

  const carregarPacientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/pacientes", { headers: getAuthHeaders() });
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });
      const data = await res.json();
      setEventos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarPacientes();
    carregarEventos();
  }, []);

  // Filtros
  const eventosFiltrados = eventos.filter((e) => {
    if (e.status === "indisponível") return false;
    const pacienteOk = filtroPaciente ? e.pacienteId === parseInt(filtroPaciente) : true;
    const statusOk = filtroStatus ? e.status === filtroStatus : true;
    return pacienteOk && statusOk;
  });

  const concluidas = eventosFiltrados.filter((e) => e.status === "concluída");
  const outras = eventosFiltrados.filter((e) => e.status !== "concluída");

  // Abrir modal
  const abrirModal = (consulta) => {
    setEventoSelecionado(consulta);
    setModalOpen(true);
  };

  // Salvar descrição
  const salvarDescricao = async (descricaoFinal, anexos) => {
    if (!eventoSelecionado) return;

    try {
      const response = await fetch(`${API_URL}/${eventoSelecionado.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ descricao: descricaoFinal }),
      });

      if (!response.ok) throw new Error("Erro ao salvar descrição");
      const consultaAtualizada = await response.json();

      setEventos((prev) =>
        prev.map((c) =>
          c.id === consultaAtualizada.id ? consultaAtualizada : c
        )
      );

      setModalOpen(false);

      // Tratar anexos se necessário
      if (anexos.length > 0) {
        console.log('Anexos para upload:', anexos);
      }

    } catch (err) {
      console.error("Erro ao salvar descrição:", err);
    }
  };

  // Atualizar status
  const atualizarStatus = async (id, novoStatus) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: novoStatus }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar status");
      const eventoAtualizado = await response.json();

      setEventos((prev) =>
        prev.map((e) => (e.id === eventoAtualizado.id ? eventoAtualizado : e))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const verProntuario = (pacienteId) => {
    window.location.href = `/main/pacientes/${pacienteId}/prontuario`;
  };

  return (
    <div className="container mt-4">

      {/* Filtros */}
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-sm-6 col-md-4">
          <label className="form-label">Paciente</label>
          <select
            value={filtroPaciente}
            onChange={(e) => setFiltroPaciente(e.target.value)}
            className="form-select"
          >
            <option value="">Todos</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-3">
          <label className="form-label">Status</label>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="form-select"
          >
            <option value="">Todos</option>
            <option value="agendada">Agendada</option>
            <option value="concluída">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabelas Componentizadas */}
      <div className="mb-4">
        <ConsultaTable
          consultas={concluidas}
          tipo="concluída"
          onAbrirDescricao={abrirModal}
          onVerProntuario={verProntuario}
          onAtualizarStatus={atualizarStatus}
        />
      </div>

      <div>
        <ConsultaTable
          consultas={outras}
          tipo="outras"
          onAbrirDescricao={abrirModal}
          onVerProntuario={verProntuario}
          onAtualizarStatus={atualizarStatus}
        />
      </div>

      {/* Modal Componentizado */}
      <ConsultaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        consulta={eventoSelecionado}
        onSalvar={salvarDescricao}
      />
    </div>
  );
}