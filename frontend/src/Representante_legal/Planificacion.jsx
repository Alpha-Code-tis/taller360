import { API_URL } from '../config';              
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Planificacion.css';
import { useDateFormatter } from "@react-aria/i18n";
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
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

const Planificacion = () => {
  const initialTareas = [];
  const [error, setError] = useState(null);
  let formatter = useDateFormatter({ dateStyle: "long" });
  const [currentTareas, setCurrentTareas] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [value, setValue] = React.useState(dayjs());
  const [myEventsList, setMyEventsList] = useState([]);
  const [hu, setHu] = useState(initialTareas);
  const [isOpen, setIsOpen] = useState(false); // Controla si el menú desplegable está abierto
  const [selectedSprint, setSelectedSprint] = useState(""); // Estado para el sprint seleccionado
  const [sprints, setSprints] = useState([]); // Estado para almacenar los sprints obtenidos de la API
  const [fechaInicio, setFechaInicio] = useState(null); // Fecha inicio seleccionada
  const [fechaFinal, setFechaFinal] = useState(null); // Fecha fin seleccionada
  const [requerimiento,setRequerimiento] = useState('');
  const [tareas, setTareas]=useState([]);
  const [alcances, setAlcances] = useState([]);
  const [porcentaje, setPorcentaje] = useState([]);

  const [eventos, setEventos] = useState([]); // Almacenará los eventos que se mostrarán en el calendario
  const [showModalEvent, setShowModalEvent] = useState();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);  // Guardar el evento seleccionado
    setShowModalEvent(true);       // Mostrar el modal
  }

  const handleCloseModalEvent = () => setShowModalEvent(false);
  const [formValues, setFormValues] = useState({
    tarea: '',
    nSprint: '',
    requerimiento: '',
    color: '',
    porcentaje: '',
    fechaInicio: '',
    fechaFinal: '',
  });

  const [showModal, setShowModal] = useState(false);
  const handleSave = async () => {
    // Llamar a validateForm antes de proceder
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    const loadingToastId = toast.loading('Cargando datos...');
    try {
      // Agregar un console.log para depuración
      console.log('Enviando formValues:', formValues);
      console.log('Enviando tareas:', hu);

      const response = await axios.post(`${API_URL}planificacion`, {
        nro_sprint: formValues.nSprint,
        color: formValues.color,
        porcentaje: formValues.porcentaje,
        fecha_inicio: formValues.fechaInicio,
        fecha_fin: formValues.fechaFinal,
        requerimiento: formValues.requerimiento,
        tareas: hu.map(tarea => ({
          nombre: tarea.tarea,
          estimacion: tarea.estimacion
        })),
      });
      toast.dismiss(loadingToastId);
      toast.success('Datos guardados exitosamente:');
    } catch (error) {
      // Cerrar el toast de carga antes de mostrar el error
      toast.dismiss(loadingToastId); // Cerrar el toast de carga
      // Verificar si hay una respuesta del servidor y mostrar los errores
      // Verificar si hay una respuesta del servidor y mostrar los errores
      let errorMessage = 'Ocurrió un error.';

      if (error.response) {
        const responseData = error.response.data;

        // Verificar si hay un mensaje de conflicto específico
        if (responseData.message) {
          errorMessage = responseData.message;
        }

        // Si hay errores de validación
        if (responseData.errors) {
          const backendErrors = responseData.errors;
          errorMessage += ' Errores: ' + Object.values(backendErrors).join(', '); // Mostrar errores específicos
        }
      }

      // Mostrar el mensaje de error junto con los datos que se intentaron enviar
      toast.error(errorMessage);
    }
  };

  const handleShowModal = () => {
    setFormValues({
      tarea: '',
      nSprint: '',
      requerimiento: '',
      color: '',
      porcentaje: '',
      fechaInicio: '',
      fechaFinal: '',
    });
    setShowModal(true);
  };

  const [formErrors, setFormErrors] = useState({});

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hu.slice(indexOfFirstItem, indexOfLastItem);

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



  const validateForm = () => {
    const errors = {};
    // Validación de la fecha de inicio
    if (!formValues.fechaInicio) {
      errors.fechaInicio = 'La fecha de inicio es obligatoria.';
    }

    // Validación de la fecha de fin
    if (!formValues.fechaFinal) {
      errors.fechaFinal = 'La fecha de fin es obligatoria.';
    }

    if (formValues.fechaInicio && formValues.fechaFinal) {
      const startDate = dayjs(formValues.fechaInicio).startOf('day');
      const endDate = dayjs(formValues.fechaFinal).startOf('day');

    }

    if (/\d/.test(formValues.requerimiento)) {
      errors.requerimiento = 'El requerimiento no debe contener números.';
    }
    if (!/^\d+$/.test(formValues.nSprint)) {
      errors.nSprint = 'El número de sprint debe contener solo números.';
    }
    if (!/^\d+$/.test(formValues.porcentaje)) {
      errors.porcentaje = 'El número de porcentaje debe contener solo números.';
    }

    if (/\d/.test(formValues.tarea)) {
      errors.tarea = 'La tarea no debe contener números.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTarea = () => {
    console.log(formValues);
    // Verifica que tarea sea un string no vacío y estimacion sea un número válido
    const isTareaValid = typeof formValues.tarea === 'string' && formValues.tarea.trim() !== '';

    // Asegúrate de que estimacion sea un string y un número válido
    const estimacionValue = formValues.estimacion.toString(); // Convierte a string
    const isEstimacionValid = !isNaN(estimacionValue) && Number(estimacionValue.trim()) > 0;

    if (isTareaValid && isEstimacionValid) { // Asegúrate de que el campo no esté vacío
      const newTarea = {
        id: hu.length + 1, // Genera un ID único (puedes mejorarlo más adelante)
        tarea: formValues.tarea.trim(),
        estimacion: Number(estimacionValue.trim()),
      };
      setHu((prevHu) => [...prevHu, newTarea]); // Agrega la nueva tarea
      setFormValues((prevValues) => ({
        ...prevValues,
        tarea: '',
        estimacion: '',
      })); // Limpia solo los campos de tarea y estimacion

      const newHuLength = hu.length + 1;
      // Cambiar a la última página si hay más elementos que la página actual
      if (currentPage < Math.ceil(newHuLength / itemsPerPage)) {
        setCurrentPage(Math.ceil(newHuLength / itemsPerPage));
      }

    } else {
      // Opcional: Agregar retroalimentación para el usuario si la entrada es inválida
      console.error("Entrada inválida: ", {
        tarea: isTareaValid,
        estimacion: isEstimacionValid
      });
    }

  };


  const handleDelete = (id) => {
    const updatedTareas = hu.filter((tarea) => tarea.id !== id);
    setHu(updatedTareas);

    // Ajustar la página si se elimina el último elemento de la página actual
    if (updatedTareas.length % itemsPerPage === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleShowEditModal = (tarea) => {
    setFormValues(tarea); // Cargar los valores de la tarea seleccionada
    setShowEditModal(true); // Abrir el modal de edición
  };

  const handleSaveEdit = () => {
    const updatedHu = hu.map((item) =>
      item.id === formValues.id ? { ...item, ...formValues } : item
    );
    setHu(updatedHu); // Actualizar la lista de tareas
    setShowEditModal(false); // Cerrar el modal después de guardar
  };

  const totalPages = Math.ceil(hu.length / itemsPerPage);

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
      const response = await axios.get(`${API_URL}planificacion`);
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
};


  // Función para obtener los sprints de la API
  const fetchSprints = async () => {
    try {
      const response = await axios.get(`${API_URL}listarSprints`);
      setSprints(response.data); // Almacena los sprints obtenidos
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
    }
  };

  // useEffect para cargar los sprints cuando el componente se monta
  useEffect(() => {
    fetchSprints();
  }, []);



  return (
    <div className="container custom-container pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <div className="sprint-dropdown me-5" style={{ position: 'absolute', right: '1080px' }}> {/* Añadido 'me-2' para margen a la derecha */}
            <button className="btn btn-primary" onClick={toggleDropdown}>
              Sprint <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
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
          <div className="row justify-content-center mb-4">
      <div className="col-md-1 text-center">
        <h1
          className="m-0 ms-5 me-5"
          style={{ position: 'relative', top: '-110px' }} // Mueve el título hacia arriba
        >
          Planificación
        </h1>
      </div>
    </div>
        </div>
        <button className="btn btn-primary" onClick={() => handleShowModal()}style={{ position: 'absolute', right: '210px' }}>Registrar</button>
      </div>
      {error && <p className="text-danger">{error}</p>}

      <div style= {{ marginLeft: '148px', marginTop: '-100px', height: '360px' }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            culture='es'
            messages={messages}
            style={{ margin: "50px" }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.style.backgroundColor, // Aplicar el color del evento
                color: 'white', // Color del texto
                borderRadius: '5px',
                border: 'none',
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

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}className="custom custom-width-modal">
        <Modal.Body className='custom-modal'>
          <Form>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="formFechaInicio">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={fechaInicio}
                      onChange={(newValue) => {
                        setFechaInicio(dayjs(newValue)); // Actualiza el estado de la fecha
                        setFormValues((prevValues) => ({
                          ...prevValues,
                          fechaInicio: dayjs(newValue).format('DD/MM/YYYY'), // Actualiza formValues también
                        }));
                      }}
                      slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
                      sx={{
                        width: '100%',
                        '@media (max-width:600px)': {
                          fontSize: '0.875rem', // Tamaño de fuente reducido en pantallas pequeñas
                        },
                        '& .MuiInputBase-root': { height: '39px' },
                      }}

                    />
                  </LocalizationProvider>
                  {formErrors.fechaInicio && <div className="text-danger">{formErrors.fechaInicio}</div>}
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="formFechaFin">
                  <Form.Label>Fecha Final</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={fechaFinal}
                      onChange={(newValue) => {
                        setFechaFinal(dayjs(newValue)); // Actualiza el estado de la fecha
                        setFormValues((prevValues) => ({
                          ...prevValues,
                          fechaFinal: dayjs(newValue).format('DD/MM/YYYY'), // Actualiza formValues también
                        }));
                      }}
                      slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
                      sx={{
                        width: '100%',
                        '@media (max-width:600px)': {
                          fontSize: '0.875rem', // Tamaño de fuente reducido en pantallas pequeñas
                        },
                        '& .MuiInputBase-root': { height: '39px' },
                      }}
                    />
                  </LocalizationProvider>
                  {formErrors.fechaFinal && <div className="text-danger">{formErrors.fechaFinal}</div>}
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="formNsprint">
                  <Form.Label>N° Sprint</Form.Label>
                  <Form.Control
                    type="number"
                    name="nSprint"
                    value={formValues.nSprint}
                    onChange={handleInputChange}
                    placeholder="Numero Sprint"
                    isInvalid={!!formErrors.nSprint}
                  />
                  {formErrors.nSprint && <div className="text-danger">{formErrors.nSprint}</div>}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formColor">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    type="color"
                    name="color"
                    value={formValues.color}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="formPorcentaje">
                  <Form.Label> % Cobro</Form.Label>
                  <Form.Control
                    type="number"
                    name="porcentaje"
                    value={formValues.porcentaje}
                    onChange={handleInputChange}
                    placeholder="PorcentajeCobro"
                    isInvalid={!!formErrors.porcentaje}
                  />
                  {formErrors.porcentaje && <div className="text-danger">{formErrors.porcentaje}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formAlcance">
                  <Form.Label>Requerimiento</Form.Label>
                  <Form.Control
                    type="text"
                    name="requerimiento"
                    value={formValues.requerimiento}
                    onChange={handleInputChange}
                    placeholder="Requerimiento"
                    isInvalid={!!formErrors.requerimiento}
                  />
                  {formErrors.requerimiento && <div className="text-danger">{formErrors.requerimiento}</div>}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">

              <Col md={6}>
                <Form.Group controlId="formHU">
                  <Form.Label>HU-Tarea</Form.Label>
                  <Form.Control
                    type="text"
                    name="tarea"
                    value={formValues.tarea}
                    onChange={handleInputChange}
                    placeholder="HUTarea"
                    isInvalid={!!formErrors.tarea}
                  />
                  {formErrors.tarea && <div className="text-danger">{formErrors.tarea}</div>}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formEstimacion">
                  <Form.Label>Estimación</Form.Label>
                  <Form.Control
                    type="number"
                    name="estimacion"
                    value={formValues.estimacion}
                    onChange={handleInputChange}
                    placeholder="Estimacion"
                    isInvalid={!!formErrors.estimacion}
                  />
                  {formErrors.estimacion && <div className="text-danger">{formErrors.estimacion}</div>}
                </Form.Group>
              </Col>

              <Col md={3} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px' }}>
                <Form.Group>
                  <Button className="btn btn-primary" onClick={handleAddTarea}>+</Button>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col mb={12}>
                <div className="table-container custom">
                  <table className="table table-hover hu-table">
                    <thead className="table-light">
                      <tr>
                        <th>HU-Tareas</th>
                        <th>Estimación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>

                      {currentItems.length > 0 ? (
                        currentItems.map((tarea) => (
                          <tr key={tarea.id}>
                            <td>{tarea.tarea}</td>
                            <td>{tarea.estimacion}</td>
                            <td>
                              <button className="icon-button" title="Eliminar" onClick={() => handleDelete(tarea.id)}>
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">No hay tareas disponibles.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* Paginación */}
          <div className="pagination-container">
            <Button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </Button>
            <span className="pagination-info">{`Página ${currentPage} de ${totalPages}`}</span>
            <Button
              className="pagination-button"
              disabled={currentPage === totalPages || hu.length <= itemsPerPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button type="button" className="btn btn-primary" onClick={handleSave} >Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Planificacion;