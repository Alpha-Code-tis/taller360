import React, { useState, useEffect } from 'react';

// Importamos los componentes y estilos necesarios
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PlanificacionEquipos.css';
import dayjs from 'dayjs';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDateFormatter } from "@react-aria/i18n";
import axios from 'axios';

const localizer = momentLocalizer(moment); // or globalizeLocalizer

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
    const [fechaInicio, setFechaInicio] = useState(null); // Fecha inicio seleccionada
    const [fechaFinal, setFechaFinal] = useState(null); // Fecha fin seleccionada
    const [requerimiento,setRequerimiento] = useState('');
    const [tareas, setTareas]=useState([]);
    
    const [eventos, setEventos] = useState([]); // Almacenará los eventos que se mostrarán en el calendario
    const [showModalEvent, setShowModalEvent] = useState();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);  // Guardar el evento seleccionado
        setShowModalEvent(true);       // Mostrar el modal
    }

    const handleCloseModalEvent = () => setShowModalEvent(false);
    const toggleSprintDropdown = () => setIsSprintOpen(!isSprintOpen);
    const toggleGestionDropdown = () => setIsGestionOpen(!isGestionOpen);
    const toggleEmpresaDropdown = () => setIsEmpresaOpen(!isEmpresaOpen);

    const handleInputChange = (eventOrValue, fieldName) => {
        if (fieldName) {
          // Para el DatePicker u otros componentes que no disparan un evento clásico
          setFormValues((prevValues) => ({
            ...prevValues,
            [fieldName]: eventOrValue, // El valor viene directamente
          }));
        } else {
          // Para inputs que sí disparan eventos (event.target)
          const { name, value, type } = eventOrValue.target;
    
          let newValue = value;
    
          if (type === 'number') {
            newValue = value === '' ? '' : Number(value);
          }
    
          setFormValues((prevValues) => ({
            ...prevValues,
            [name]: newValue, // Actualiza el valor basado en el nombre del campo
          }));
        }
      };

            // Función para alternar el menú desplegable
        const toggleDropdown = () => {
            setIsOpen(!isOpen);
        };

  // Función para manejar el cambio de opción seleccionada
  const handleOptionChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedSprint(selectedId);


    // Aquí haces la llamada a la API de planificacion para obtener las fechas de inicio, fin y color del sprint
    try {
      const response = await axios.get(`http://localhost:8000/api/planificacion`);
      console.log(response.data); // Verificar qué datos devuelve la API
      const sprints = response.data.sprints;

      if (selectedId === "Todos") {
        // Si se selecciona "todos", pintar todos los sprints
        const eventos = sprints.map((sprint) => {
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
        const sprintData = sprints.find((sprint) => sprint.nro_sprint === parseInt(selectedId));

        if (sprintData) {
          const inicio = dayjs(sprintData.fecha_inicio);
          const fin = dayjs(sprintData.fecha_fin);
          const color = sprintData.color || '#ff0000'; // Valor por defecto si no hay color
          setFechaInicio(inicio);
          setFechaFinal(fin);
          // Verifica si hay alcances y tareas
          const alcance = sprintData.alcances?.[0]; // Asignar el primer alcance
          setRequerimiento(alcance?.descripcion || 'No hay requerimiento disponible');

          const tareas = alcance?.tareas || [];
          setTareas(tareas);

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
  };


  // Función para obtener los sprints de la API
  const fetchSprints = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/listarSprints");
      setSprints(response.data); // Almacena los sprints obtenidos
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
    }
  };

  // useEffect para cargar los sprints cuando el componente se monta
  useEffect(() => {
    fetchSprints();
  }, []);


    // Renderizamos el componente Calendar con los eventos
    return (
        <div className="container custom-container pt-3">
            <div className="d-flex justify-content-end"style={{ marginRight: '-410px' }}>   
                    {/* Menú desplegable de Sprint */}
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
                                            checked={selectedSprint === sprint}
                                            onChange={handleOptionChange}
                                        />
                                        Sprint {sprint}
                                    </label>
                                ))}
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="Todos"
                                        checked={selectedSprint === 'Todos'}
                                        onChange={handleOptionChange}
                                    />
                                    Todos
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Menú desplegable de Gestión */}
                    <div className="gestion-dropdown me-5">
                        <button className="btn btn-primary" onClick={toggleGestionDropdown}>
                            Gestión <span className="arrow">{isGestionOpen ? '▲' : '▼'}</span>
                        </button>
                        {isGestionOpen && (
                            <div className="dropdown-menu show">
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="2024"
                                        checked={selectedGestion === '2024'}
                                        onChange={(e) => setSelectedGestion(e.target.value)}
                                    />
                                    2024
                                </label>
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="2023"
                                        checked={selectedGestion === '2023'}
                                        onChange={(e) => setSelectedGestion(e.target.value)}
                                    />
                                    2023
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Menú desplegable de Empresa */}
                    <div className="empresa-dropdown me-5">
                        <button className="btn btn-primary" onClick={toggleEmpresaDropdown}>
                            Empresa <span className="arrow">{isEmpresaOpen ? '▲' : '▼'}</span>
                        </button>
                        {isEmpresaOpen && (
                            <div className="dropdown-menu show">
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="Empresa 1"
                                        checked={selectedEmpresa === 'Empresa 1'}
                                        onChange={(e) => setSelectedEmpresa(e.target.value)}
                                    />
                                    Empresa 1
                                </label>
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="Empresa 2"
                                        checked={selectedEmpresa === 'Empresa 2'}
                                        onChange={(e) => setSelectedEmpresa(e.target.value)}
                                    />
                                    Empresa 2
                                </label>
                            </div>
                        )}
                    </div>
            </div>
            <div style={{ marginTop: '-100px', height: '360px' }}> {/* Establecemos una altura para el calendario */}
                <Calendar
                    localizer={localizer}  // Usamos el localizador configurado
                    events={eventos}       // Pasamos los eventos al calendario
                    startAccessor="start"  // Indicamos que el atributo 'start' contiene la fecha de inicio
                    endAccessor="end"      // Indicamos que el atributo 'end' contiene la fecha de finalización
                    style={{ margin: '50px' }}  // Aplicamos algunos estilos
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.style.backgroundColor,  // Color de fondo del evento
                            color: 'white',  // Color del texto dentro del evento
                            borderRadius: '5px',  // Redondeo de esquinas
                            border: 'none',  // Sin borde para los eventos
                        },
                    })}
                    onSelectEvent={handleSelectEvent}
                />
                {selectedEvent && (
                <Modal show={showModalEvent} onHide={handleCloseModalEvent}>
                    <Modal.Header>
                    <Modal.Title>Detalles del {selectedEvent.title}</Modal.Title>
                    </Modal.Header>
                <Modal.Body>
                    <p><strong>Fecha de inicio:</strong> {fechaInicio ? fechaInicio.format('DD/MM/YYYY') : 'Fecha no disponible'}</p>
                    <p><strong>Fecha de fin:</strong> {fechaFinal ? fechaFinal.format('DD/MM/YYYY') : 'Fecha no disponible'}</p>
                    <p><strong>Requerimiento:</strong> {requerimiento}</p>

                    <h5>Tareas</h5>
                    {tareas.length > 0 ? (
                    <ul>
                        {tareas.map((tarea, index) => (
                        <li key={index}>
                            <strong>{tarea.nombre_tarea}:</strong> {tarea.estimacion} horas
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p>No hay tareas disponibles para este sprint.</p>
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
    );
};

export default MyCalendar;

