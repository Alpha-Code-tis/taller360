import React, { useState } from 'react';
// Importamos los componentes y estilos necesarios
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PlanificacionEquipos.css';

// Configuramos el localizador con Moment.js para manejar fechas
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
    const [isSprintOpen, setIsSprintOpen] = useState(false); // Controla si el menú desplegable está abierto
    const [isGestionOpen, setIsGestionOpen] = useState(false); // Controla si el menú "Gestión" está abierto
    const [isEmpresaOpen, setIsEmpresaOpen] = useState(false); // Controla si el menú "Empresa" está abierto
    
    const [selectedGestion, setSelectedGestion] = useState(""); // Estado para la gestión seleccionada
    const [selectedEmpresa, setSelectedEmpresa] = useState("");
    const [selectedSprint, setSelectedSprint] = useState(""); // Estado para el sprint seleccionado
    const [sprints, setSprints] = useState([]); // Estado para almacenar los sprints obtenidos de la API
    // Definimos los eventos de ejemplo
    const [eventos, setEventos] = useState([
        {
            title: 'Reunión con el equipo',
            start: new Date(2024, 9, 15, 10, 0),  // Fecha de inicio del evento
            end: new Date(2024, 9, 15, 11, 0),    // Fecha de finalización del evento
            style: { backgroundColor: 'red' },    // Estilo personalizado para el evento
        },
        {
            title: 'Llamada con cliente',
            start: new Date(2024, 9, 16, 14, 0),
            end: new Date(2024, 9, 16, 15, 0),
            style: { backgroundColor: 'green' },
        },
    ]);

    const toggleSprintDropdown = () => setIsSprintOpen(!isSprintOpen);
    const toggleGestionDropdown = () => setIsGestionOpen(!isGestionOpen);
    const toggleEmpresaDropdown = () => setIsEmpresaOpen(!isEmpresaOpen);

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
                                    <label className="dropdown-item" key={sprint.id_sprint}>
                                        <input
                                            type="radio"
                                            value={sprint.id_sprint}
                                            checked={selectedSprint === sprint.id_sprint}
                                            onChange={(e) => setSelectedSprint(e.target.value)}
                                        />
                                        Sprint {sprint.nro_sprint}
                                    </label>
                                ))}
                                <label className="dropdown-item">
                                    <input
                                        type="radio"
                                        value="Todos"
                                        checked={selectedSprint === 'Todos'}
                                        onChange={(e) => setSelectedSprint(e.target.value)}
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
                    views={['month', 'week', 'day']}  // Las vistas disponibles en el calendario
                    defaultView="month"  // La vista predeterminada al cargar el calendario
                />
            </div>
        </div>        
    );
};


export default MyCalendar;

