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
import "./Agendamento.css";

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

  const [config, setConfig] = useState(() => {
    const savedConfig = localStorage.getItem('calendarConfig');
    return savedConfig ? JSON.parse(savedConfig) : {
      initialView: "dayGridMonth",
      slotMinTime: "08:00:00",
      slotMaxTime: "18:00:00",
    };
  });

  useEffect(() => {
    const buscarDentistaId = async () => {
      try {
        const res = await fetch(`http://localhost:3001/dentistas`, {
          headers: getAuthHeaders()
        });
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

  useEffect(() => {
    localStorage.setItem('calendarConfig', JSON.stringify(config));
  }, [config]);

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

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

    if (dataClicada < new Date(agora.setHours(0, 0, 0, 0))) {
      alert("Não é possível agendar em datas passadas");
      return;
    }

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

  const handleConfigSalvar = (novaConfig) => {
    setConfig(novaConfig);
    setMostrarModalConfig(false);
  };

  const eventosFiltrados = eventos.filter(
    (ev) => ev.extendedProps?.dentistaId === dentistaSelecionado
  );

  if (!dentistaSelecionado) {
    return <div className="carregandoAgenda">Carregando...</div>;
  }

  return (
    <>
      <div className="agendaContainer">
        <div className="agendaHeader">
          <h1 className="agendaTitle">Agenda</h1>
          <div className="botoesAgenda">
            <button
              onClick={() => handleDateClick({ date: new Date() })}
              className="btnNovoEvento"
            >
              Novo Evento
            </button>
            <button
              onClick={() => setMostrarModalConfig(true)}
              className="btnConfiguracoes"
            >
              Configurações
            </button>
          </div>
        </div>

        <div className="calendarioContainer">
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
            fixedWeekCount={false}
            showNonCurrentDates={false}
            firstDay={0}
            allDaySlot={false}
          />
        </div>
      </div>

      <NovoEventoModal
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        dataSelecionada={dataSelecionada}
        onSuccess={carregarEventos}
        dentistaId={dentistaSelecionado}
        modoVisualizacao={modoVisualizacao}
        setModoVisualizacao={setModoVisualizacao}
        config={config}
      />

      <ConfigCalendarModal
        isOpen={mostrarModalConfig}
        onClose={() => setMostrarModalConfig(false)}
        onSave={handleConfigSalvar}
        config={config}
        setConfig={setConfig}
      />
    </>
  );
}