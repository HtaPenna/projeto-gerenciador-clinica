import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NovoEventoModal from "./AgendamentoForm.jsx";
import ConfigCalendarModal from "./ConfigAgenda.jsx";

const API_URL = "http://localhost:3001/eventos";
const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

export default function AgendaVisual() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarModalConfig, setMostrarModalConfig] = useState(false);
  const [dentistaSelecionado, setDentistaSelecionado] = useState(1); // Dentista ativo

  // Configurações ajustáveis pelo usuário
  const [config, setConfig] = useState({
    initialView: "dayGridMonth",
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
  });

  // Carrega eventos do backend
  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL);
      const dados = await res.json();

      const eventosFormatados = dados.map((ev) => {
        // Define cor do evento baseado no status
        let cor = "#00A39C"; // padrão
        if (ev.status === "pendente") cor = "#FACC15"; // amarelo
        else if (ev.status === "confirmada") cor = "#10B981"; // verde
        else if (ev.status === "bloqueado") cor = "#9CA3AF"; // cinza

        return {
          id: ev.id,
          title: ev.paciente?.nome || `Paciente ID: ${ev.pacienteId}`,
          start: ev.inicio,
          end: ev.fim,
          color: cor,
          extendedProps: {
            pacienteId: ev.pacienteId,
            dentistaId: ev.dentistaId,
            status: ev.status,
            valorPrevisto: ev.valorPrevisto,
            observacoes: ev.observacoes,
          },
        };
      });

      setEventos(eventosFormatados);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const handleDateClick = (info) => {
    const agora = new Date();
    const dataClicada = info.date;
    if (dataClicada < new Date(agora.setHours(0, 0, 0, 0))) return;

    setDataSelecionada(dataClicada);
    setMostrarModal(true);
  };

  // Filtra eventos do dentista selecionado
  const eventosFiltrados = eventos.filter(
    (ev) => ev.extendedProps.dentistaId === dentistaSelecionado
  );

  return (
    <div className="p-6 z-0" style={{ marginLeft: "100px" }}>
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setDataSelecionada(new Date());
            setMostrarModal(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Novo Evento
        </button>

        <button
          onClick={() => setMostrarModalConfig(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Configurações
        </button>

        <select
          value={dentistaSelecionado}
          onChange={(e) => setDentistaSelecionado(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value={1}>Dentista 1</option>
          <option value={2}>Dentista 2</option>
          <option value={3}>Dentista 3</option>
        </select>
      </div>

      <div style={{ width: "calc(100% - 90px)" }}>
        <FullCalendar
          plugins={plugins}
          initialView={config.initialView}
          slotMinTime={config.slotMinTime}
          slotMaxTime={config.slotMaxTime}
          dayHeaderFormat={{ weekday: "short" }}
          locale={ptBrLocale}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridDay,timeGridWeek,dayGridMonth",
          }}
          events={eventosFiltrados}
          dateClick={handleDateClick}
          height="auto"
        />
      </div>

      <NovoEventoModal
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        dataSelecionada={dataSelecionada}
        onSuccess={carregarEventos}
        dentistaId={dentistaSelecionado}
      />

      <ConfigCalendarModal
        isOpen={mostrarModalConfig}
        onRequestClose={() => setMostrarModalConfig(false)}
        config={config}
        setConfig={setConfig}
      />
    </div>
  );
}
