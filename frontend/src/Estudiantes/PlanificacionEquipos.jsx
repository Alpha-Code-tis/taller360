import { API_URL } from '../config';              
import React, { useState, useEffect } from 'react';

// Importamos los componentes y estilos necesarios

import './PlanificacionEquipos.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import dayjs from 'dayjs';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango.',
};

 // Función para mostrar los días y meses en español usando dayjs
 const obtenerDiaMesEnEspañol = (fecha) => {
  const formatoDia = dayjs(fecha).locale('es').format('dddd'); // Día completo en español
  const formatoMes = dayjs(fecha).locale('es').format('MMMM'); // Mes completo en español
  return { dia: formatoDia, mes: formatoMes };
};
// Función para filtrar sábados y domingos
const filtrarDiasHabiles = (fechaInicio, fechaFin) => {
  const fechas = [];
  let currentDate = dayjs(fechaInicio);

  while (currentDate.isBefore(fechaFin) || currentDate.isSame(fechaFin, 'day')) {
    const dayOfWeek = currentDate.day();
    // Excluir sábado (6) y domingo (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      fechas.push(currentDate.toDate()); // Agregar solo días de lunes a viernes
    }
    currentDate = currentDate.add(1, "day");
  }

  return fechas;
};
const MyCalendar = () => {
    const [isSprintOpen, setIsSprintOpen] = useState(false); // Controla si el menú desplegable está abierto
    const [isGestionOpen, setIsGestionOpen] = useState(false); // Controla si el menú "Gestión" está abierto
    const [isEmpresaOpen, setIsEmpresaOpen] = useState(false); // Controla si el menú "Empresa" está abierto
    
    const [selectedGestion, setSelectedGestion] = useState(""); // Estado para la gestión seleccionada
    const [selectedEmpresa, setSelectedEmpresa] = useState("");
    const [selectedSprint, setSelectedSprint] = useState(""); // Estado para el sprint seleccionado
    const [sprints, setSprints] = useState([]); // Estado para almacenar los sprints obtenidos de la API
    const [sprints2, setSprints2] = useState([]); // Estado para almacenar los sprints obtenidos de la API
    const [gestiones, setGestiones] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [eventos, setEventos] = useState([]); // Almacenará los eventos que se mostrarán en el calendario
    const [showModalEvent, setShowModalEvent] = useState();
    const [fechaInicio, setFechaInicio] = useState(null); // Fecha inicio seleccionada
    const [fechaFinal, setFechaFinal] = useState(null); // Fecha fin seleccionada
    const [requerimiento,setRequerimiento] = useState('');
    const [tareas, setTareas]=useState([]);
    const [alcances, setAlcances] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [porcentaje, setPorcentaje] = useState([]);

    const handleSelectEvent = (event) => {
      setSelectedEvent(event);  // Guardar el evento seleccionado
      setShowModalEvent(true);       // Mostrar el modal
    }

    const handleCloseModalEvent = () => setShowModalEvent(false);
    const toggleSprintDropdown = () => setIsSprintOpen(!isSprintOpen);
    const toggleGestionDropdown = () => setIsGestionOpen(!isGestionOpen);
    const toggleEmpresaDropdown = () => setIsEmpresaOpen(!isEmpresaOpen);


    // Función para alternar el menú desplegable
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const handleOptionChangeG = async (event) => {
      const selectedG = event.target.value;
      setSelectedGestion(selectedG);

      // Llamada a la API para obtener las empresas filtradas por la gestión seleccionada
      try {
        const response = await axios.get(`${API_URL}listarEmpresas/${selectedG}`);
        setEmpresas(response.data); // Almacena las empresas obtenidas
      } catch (error) {
          console.error("Error al obtener las empresas:", error);
      }

      setIsGestionOpen(false); // Cierra el dropdown

    };

    const handleOptionE = async (event) => {
      const selectedEmpresa = event.target.value;
      setSelectedEmpresa(selectedEmpresa);

        // Reiniciar estados relacionados al sprint y calendario
        setSelectedSprint(null);
        setEventos([]);
        setFechaInicio(null);
        setFechaFinal(null);
        setAlcances([]);
  
      try {
          // Llama a la API usando el valor de la empresa seleccionada
          const response = await axios.get(`${API_URL}listarSprintsEmpresa/${selectedEmpresa}`);
          const sprintData = response.data;
          setSprints(sprintData); // Almacena los sprints obtenidos
           // Si hay sprints, selecciona automáticamente el primero y carga sus datos
          if (sprintData.length > 0) {
            const primerSprint = sprintData[0].id_sprint;
            setSelectedSprint(primerSprint);
            await cargarDatosSprint(primerSprint, selectedEmpresa);
          }
        } catch (error) {
          console.error("Error al obtener los sprints:", error);
      }

      setIsEmpresaOpen(false); // Cierra el dropdown
  };
  
  const cargarDatosSprint = async (sprintId, empresaId) => {
    try {
        const response = await axios.get(`${API_URL}planificacion/${empresaId}/${selectedGestion}/${sprintId}`);
        const sprintData = response.data[0][0].sprints;

        const sprintSeleccionado = sprintData.find((sprint) => sprint.id_sprint === sprintId);
        if (sprintSeleccionado) {
            const inicio = dayjs(sprintSeleccionado.fecha_inicio);
            const fin = dayjs(sprintSeleccionado.fecha_fin);
            const color = sprintSeleccionado.color || '#ff0000';

            setFechaInicio(inicio);
            setFechaFinal(fin);

            const diasHabiles = filtrarDiasHabiles(inicio, fin);
            setEventos(
                diasHabiles.map((fecha) => ({
                    title: `Sprint ${sprintSeleccionado.nro_sprint}`,
                    start: fecha,
                    end: fecha,
                    style: { backgroundColor: color },
                }))
            );
        }
    } catch (error) {
        console.error("Error al cargar los datos del sprint:", error);
    }
};

  useEffect(() => {
    if (selectedEmpresa && sprints.length > 0) {
        const primerSprint = sprints[0].id_sprint;
        setSelectedSprint(primerSprint);
        cargarDatosSprint(primerSprint, selectedEmpresa);
    }
}, [sprints]);



  // Función para manejar el cambio de opción seleccionada
  const handleOptionChange = async (event) => {
    const selectedId = event.target.value;
    if (!selectedEmpresa || !selectedGestion) {
      console.error("No se ha seleccionado una empresa o gestión válida.");
      return;
    }
    setSelectedSprint(selectedId);
    console.log("Sprint seleccionado:", selectedId); // Asegúrate de que esto se imprima
    await cargarDatosSprint(selectedId, selectedEmpresa);
    // Aquí haces la llamada a la API de planificacion para obtener las fechas de inicio, fin y color del sprint
    try {
      const response = await axios.get(`${API_URL}planificacion/${selectedEmpresa}/${selectedGestion}/${selectedId}`);
      const sprints2 = response.data[0][0].sprints;
      if (selectedId === 'Todos') {
        console.log(response.data);
        const sprintsArray = response.data[0].sprints;

        // Si se selecciona "todos", pintar todos los sprints
        const eventos = sprintsArray.map((sprint) => {
          console.log(sprint);
          const inicio = dayjs(sprint.fecha_inicio);
          const fin = dayjs(sprint.fecha_fin);
          const color = sprint.color || '#ff0000'; // Valor por defecto si no hay color

          // Filtrar los días hábiles entre la fecha de inicio y fin para cada sprint
          const diasHabiles = filtrarDiasHabiles(inicio, fin);

          return diasHabiles.map((fecha) => ({
              title: `Sprint ${sprint.nro_sprint}`,
              start: fecha,
              end: fecha, // Evento de un solo día
              style: { backgroundColor: color }, // Color del evento
          }));
      });

        // Aplanar el array de eventos anidados
        setEventos(eventos.flat());
      } else {
        // Si se selecciona un sprint específico
        const sprintData = sprints2.find((sprint) => sprint.nro_sprint == parseInt(selectedId));
        if (sprintData) {
          const inicio = dayjs(sprintData.fecha_inicio);
          const fin = dayjs(sprintData.fecha_fin);
          const color = sprintData.color || '#ff0000'; // Valor por defecto si no hay color
          const porcentaje = sprintData.porcentaje;
          setPorcentaje(porcentaje);
          setFechaInicio(inicio);
          setFechaFinal(fin);

          // Mantener los alcances como un array para poder mostrar cada uno con sus tareas
          const alcances = sprintData.alcances || [];

          // Asignar alcances con sus respectivas tareas y mantener esa estructura
          const alcancesConTareas = alcances.map(alcance => ({
            descripcion: alcance.descripcion,
            tareas: alcance.tareas || []  // Si no hay tareas, se asigna un array vacío
          }));

          setAlcances(alcancesConTareas); // Guardar la estructura completa de alcances con tareas

          // Filtrar los días hábiles entre la fecha de inicio y fin
          const diasHabiles = filtrarDiasHabiles(inicio, fin);
          setEventos(
            diasHabiles.map((fecha) => ({
              title: `Sprint ${sprintData.nro_sprint}`,
              start: fecha,
              end: fecha, // Evento de un solo día
              style: { backgroundColor: color }, // Color del evento
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener los detalles del sprint:", error);
    }

    setIsSprintOpen(false);
};


  // Función para obtener los sprints de la API
  const fetchGestiones = async () => {
    try {
      const response = await axios.get(`${API_URL}gestiones`);
      
      // Si la respuesta es un solo objeto y no una lista
      const gestion = response.data; // Accede al valor directamente
      setGestiones(gestion); // Guarda la gestión como un array con un único valor
    } catch (error) {
        console.error("Error al obtener las gestiones:", error);
    }
  };

  // useEffect para cargar los sprints cuando el componente se monta
  useEffect(() => {
    const fetchGestiones = async () => {
      try {
          const response = await axios.get(`${API_URL}gestiones`);
          console.log(response.data);
          setGestiones(response.data); // Almacena las gestiones obtenidas
      } catch (error) {
          console.error("Error al obtener las gestiones:", error);
      }
    };
    fetchGestiones();
  }, []);
  

    return (
      <div className="container custom-container pt-3">
    {/* Contenedor para el título */}
    <div className="row justify-content-center mb-4">
      <div className="col-md-8 text-center">
        <h1
          className="m-0 ms-5 me-5"
          style={{ position: 'relative', top: '-110px' }} // Mueve el título hacia arriba
        >
          Planificación de Equipos
        </h1>
      </div>
    </div>

           {/* Contenedor para los menús desplegables */}
          <div className="container">
      <div className="row">
          {/* Menú desplegable de Gestión */}
          <div className="col-md-4" style={{ marginTop: '-150px' }}>
              <div className="gestion-dropdown me-5">
                  <button className="btn btn-primary" onClick={toggleGestionDropdown}>
                      Gestión <span className="arrow">{isGestionOpen ? '▲' : '▼'}</span>
                  </button>
                  {isGestionOpen && (
                      <div className="dropdown-menu show">
                          {gestiones.map((gestion) => (
                              <label className="dropdown-item" key={gestion}>
                                  <input
                                      type="radio"
                                      value={gestion}
                                      checked={selectedGestion === gestion}
                                      onChange={handleOptionChangeG}
                                  />
                                  Gestión {gestion}
                              </label>
                          ))}
                      </div>
                  )}
              </div>
          </div>

          {/* Menú desplegable de Empresa */}
          <div className="col-md-4" style={{ marginTop: '-150px' }}>
              <div className="empresa-dropdown me-5">
                  <button className="btn btn-primary" onClick={toggleEmpresaDropdown}>
                      Empresa <span className="arrow">{isEmpresaOpen ? '▲' : '▼'}</span>
                  </button>
                  {isEmpresaOpen && (
                      <div className="dropdown-menu show">
                        {empresas.map((empresa)=>(
                          <label className="dropdown-item"key={empresa.nombre_empresa}>
                              <input
                                  type="radio"
                                  value={empresa.id_empresa}
                                  checked={selectedEmpresa == empresa.id_empresa}
                                  onChange={handleOptionE}
                              />
                              {empresa.nombre_empresa}
                          </label>
                        ))}
                      </div>
                  )}
              </div>
          </div>
          {/* Menú desplegable de Sprint */}
          <div className="col-md-4" style={{ marginTop: '-150px' }}>
              <div className="sprint-dropdown me-5">
                  <button className="btn btn-primary" onClick={toggleSprintDropdown}>
                      Sprint <span className="arrow">{isSprintOpen ? '▲' : '▼'}</span>
                  </button>
                  {isSprintOpen && (
                      <div className="dropdown-menu show">
                          {sprints.map((sprint) => (
                              <label className="dropdown-item" key={sprint}>
                                  <input
                                      type="radio"
                                      value={sprint}
                                      checked={selectedSprint == sprint}
                                      onChange={handleOptionChange}
                                  />
                                  Sprint {sprint}
                              </label>
                          ))}
                      </div>
                  )}
              </div>
            
          </div>
          <div  className="col-md-9" style={{ marginLeft: '148px', marginTop: '-100px', height: '360px' }}>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    culture='es'
                    messages={messages}
                    style={{ marginTop: '3%', height: '110%' }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.style.backgroundColor,
                            color: 'white',
                            borderRadius: '5px',
                            border: '2px solid white',      
                        },
                    })}
                    onSelectEvent={handleSelectEvent}
                />
                {selectedEvent && (
        <Modal show={showModalEvent} onHide={handleCloseModalEvent}>
          <Modal.Header>
            <Modal.Title>Detalles del {selectedEvent.title} &nbsp; % Cobro: {porcentaje ? `${porcentaje}%` : 'Porcentaje no disponible'}</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <p><strong>Fecha de inicio:</strong> {fechaInicio ? fechaInicio.format('DD/MM/YYYY') : 'Fecha no disponible'}</p>
          <p><strong>Fecha de fin:</strong> {fechaFinal ? fechaFinal.format('DD/MM/YYYY') : 'Fecha no disponible'}</p>

          <h5>Requerimientos</h5>
          {alcances.length > 0 ? (
            alcances.map((alcance, index) => (
              <div key={index}>
                <p><strong>{index + 1}:</strong> {alcance.descripcion || 'No hay descripción disponible'}</p>
                {alcance.tareas.length > 0 ? (
                  <ul>
                    {alcance.tareas.map((tarea, tareaIndex) => (
                      <li key={tareaIndex}>
                        <strong>{tarea.nombre_tarea}:</strong> {tarea.estimacion} horas
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay tareas disponibles para este alcance.</p>
                )}
              </div>
            ))
          ) : (
            <p>No hay alcances disponibles para este sprint.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalEvent}>
            Cerrar
          </Button>
        </Modal.Footer>
        </Modal>
        )}
      </div>
      </div>
        </div>
      </div>

    );
}

export default MyCalendar;

