import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NovoEventoModal from "../../components/modals/AgendamentoModal/AgendamentoModal.jsx";
import ConfigCalendarModal from "../../components/modals/ConfigAgendaModal/ConfigAgendaModal.jsx";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAuth } from '../../hooks/useAuth';

const API_URL = "http://localhost:3001/eventos";
const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

export default function AgendaVisual() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mostrarModalConfig, setMostrarModalConfig] = useState(false);
  const [dentistaSelecionado, setDentistaSelecionado] = useState(null);
  const { updateTitle } = usePageTitle();
  const { getAuthHeaders } = useAuth();

  const [config, setConfig] = useState({
    initialView: "dayGridMonth",
    slotMinTime: "08:00:00",
    slotMaxTime: "18:00:00",
  });

  useEffect(() => {
    const buscarDentistaId = async () => {
      try {
        const res = await fetch(`http://localhost:3001/dentistas`, { headers: getAuthHeaders() });

        const dentistas = await res.json();

        if (dentistas.length > 0) {
          setDentistaSelecionado(dentistas[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar dentista:", error);
      }
    };

    buscarDentistaId();
  }, []);

  useEffect(() => {
    updateTitle("Agenda");
  }, [updateTitle]);

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL, { headers: getAuthHeaders() });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const dados = await res.json();

      const eventosFormatados = dados.map((ev) => {
        let cor = "#00A39C";
        if (ev.status === "z") cor = "#FACC15";
        else if (ev.status === "confirmada") cor = "#10B981";
        else if (ev.status === "bloqueado") cor = "#9CA3AF";

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
    if (dentistaSelecionado) {
      carregarEventos();
    }
  }, [dentistaSelecionado]);

  const abrirModal = (evento, somenteVisualizar = false) => {
    setDataSelecionada({
      id: evento.id,
      start: evento.start,
      end: evento.end,
      pacienteId: evento.extendedProps?.pacienteId,
      dentistaId: evento.extendedProps?.dentistaId,
      status: evento.extendedProps?.status,
      valorPrevisto: evento.extendedProps?.valorPrevisto,
      observacoes: evento.extendedProps?.observacoes,
      title: evento.title,
    });
    setModoVisualizacao(somenteVisualizar);
    setMostrarModal(true);
  };

  const handleDateClick = (info) => {
    const agora = new Date();
    const dataClicada = info.date;
    if (dataClicada < new Date(agora.setHours(0, 0, 0, 0))) return;

    setDataSelecionada({
      id: null,
      start: dataClicada,
      end: new Date(dataClicada.getTime() + 60 * 60 * 1000),
      pacienteId: null,
      dentistaId: dentistaSelecionado,
      status: "agendada",
      valorPrevisto: "",
      observacoes: "",
    });
    setModoVisualizacao(false);
    setMostrarModal(true);
  };

  const handleEventClick = (info) => {
    abrirModal(info.event, true);
  };

  const eventosFiltrados = eventos.filter(
    (ev) => ev.extendedProps?.dentistaId === dentistaSelecionado
  );

  if (!dentistaSelecionado) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6 z-0" style={{ marginLeft: "100px" }}>
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleDateClick({ date: new Date() })}
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
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      <NovoEventoModal
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        dataSelecionada={dataSelecionada}
        onSuccess={carregarEventos}
        dentistaId={dentistaSelecionado}
        modoVisualizacao={modoVisualizacao}
        setModoVisualizacao={setModoVisualizacao}
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