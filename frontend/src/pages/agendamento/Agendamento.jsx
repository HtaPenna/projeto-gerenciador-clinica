import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NovoEventoModal from "./AgendamentoForm.jsx";

const API_URL = "http://localhost:3001/eventos";
const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

export default function AgendaVisual() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  const carregarEventos = async () => {
    try {
      const res = await fetch(API_URL);
      const dados = await res.json();

      const eventosFormatados = dados.map((ev) => ({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
      }));

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

    // Se a data clicada for antes do dia atual, não abre modal
    if (dataClicada < agora.setHours(0,0,0,0)) {
        // Pode mostrar uma mensagem ou simplesmente ignorar o clique
        return;
    }

    setDataSelecionada(dataClicada);
    setMostrarModal(true);
    };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agenda Visual</h1>
      <button
        onClick={() => {
          setDataSelecionada(new Date()); // se clicar no botão "Novo Evento"
          setMostrarModal(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Novo Evento
      </button>

      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth"
        dayHeaderFormat={{ weekday: 'short' }}
        locale={ptBrLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridDay,timeGridWeek,dayGridMonth",
        }}
        events={eventos}
        dateClick={handleDateClick}        
        height="auto"
      />

      <NovoEventoModal
        isOpen={mostrarModal}
        onRequestClose={() => setMostrarModal(false)}
        dataSelecionada={dataSelecionada}
        onSuccess={carregarEventos}
        pacienteId={1}
      />
    </div>
  );
}
