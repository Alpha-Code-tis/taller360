import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './PlanificacionEquipos.css';
import dayjs from 'dayjs';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';

const localizer = momentLocalizer(moment);

// Función para filtrar sábados y domingos
const filtrarDiasHabiles = (fechaInicio, fechaFin) => {
  const fechas = [];
  let currentDate = dayjs(fechaInicio);

  while (currentDate.isBefore(fechaFin) || currentDate.isSame(fechaFin, 'day')) {
    const dayOfWeek = currentDate.day();
    // Excluir sábado (6) y domingo (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      fechas.push(currentDate.toDate());
    }
    currentDate = currentDate.add(1, "day");
  }

  return fechas;
};

// Validación de fechas
function validarFechas(fechaInicio, fechaFinal) {
  if (!fechaInicio || !fechaFinal) {
    return 'Las fechas no pueden estar vacías.';
  }
  if (fechaFinal.isBefore(fechaInicio)) {
    return 'La fecha fin no puede ser menor o igual que la fecha inicio.';
  }
  return null;
}

// Validar campo numérico: no vacío, solo dígitos
function validarCampoNumerico(valor, nombreCampo) {
  if (!valor.trim()) {
    return `El campo "${nombreCampo}" no puede estar vacío.`;
  }

  const regexNumeros = /^\d+$/;
  if (!regexNumeros.test(valor)) {
    return `El campo "${nombreCampo}" debe contener solo números.`;
  }
  return null;
}

// Validar campo texto con todas las condiciones
function validarCampoTexto(valor, nombreCampo) {
  if (!valor.trim()) {
    return `El campo "${nombreCampo}" no puede estar vacío.`;
  }

  const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/;
  if (!regexSoloLetras.test(valor)) {
    return `El campo "${nombreCampo}" debe contener solo letras, sin números ni caracteres especiales.`;
  }

  const vocales = 'aeiouáéíóúAEIOUÁÉÍÓÚ';
  
  let contadorVocales = 0;
  let contadorConsonantes = 0;
  let ultimaLetra = '';
  let repetidas = 1; 

  for (let i = 0; i < valor.length; i++) {
    const char = valor[i];

    // Letras idénticas consecutivas
    if (char === ultimaLetra) {
      repetidas++;
      if (repetidas >= 3) {
        return `El campo "${nombreCampo}" no puede tener 3 letras idénticas consecutivas.`;
      }
    } else {
      repetidas = 1;
    }

    // Vocales o consonantes
    if (vocales.includes(char)) {
      contadorVocales++;
      contadorConsonantes = 0;
      if (contadorVocales >= 3) {
        return `El campo "${nombreCampo}" no puede tener 3 vocales consecutivas.`;
      }
    } else {
      contadorConsonantes++;
      contadorVocales = 0;
      if (contadorConsonantes >= 3) {
        return `El campo "${nombreCampo}" no puede tener 3 consonantes consecutivas.`;
      }
    }

    ultimaLetra = char;
  }

  return null;
}

const MyCalendar = () => {
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  const [isGestionOpen, setIsGestionOpen] = useState(false);
  const [isEmpresaOpen, setIsEmpresaOpen] = useState(false);

  const [selectedGestion, setSelectedGestion] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [sprints, setSprints] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [showModalEvent, setShowModalEvent] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFinal, setFechaFinal] = useState(null);
  const [requerimiento, setRequerimiento] = useState('');
  const [tareas, setTareas] = useState([]);
  const [alcances, setAlcances] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [nroSprint, setNroSprint] = useState('');
  const [cobro, setCobro] = useState('');
  const [estimacion, setEstimacion] = useState('');
  const [huTarea, setHuTarea] = useState('');

  const toggleSprintDropdown = () => setIsSprintOpen(!isSprintOpen);
  const toggleGestionDropdown = () => setIsGestionOpen(!isGestionOpen);
  const toggleEmpresaDropdown = () => setIsEmpresaOpen(!isEmpresaOpen);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModalEvent(true);
  };

  const handleCloseModalEvent = () => setShowModalEvent(false);

  const handleOptionChangeG = async (event) => {
    const selectedG = event.target.value;
    setSelectedGestion(selectedG);
    try {
      const response = await axios.get(`${API_URL}listarEmpresas/${selectedG}`);
      setEmpresas(response.data);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
    setIsGestionOpen(false);
  };

  const handleOptionE = async (event) => {
    const selectedEmpresa = event.target.value;
    setSelectedEmpresa(selectedEmpresa);

    try {
      const response = await axios.get(`${API_URL}listarSprintsEmpresa/${selectedEmpresa}`);
      setSprints(response.data);
    } catch (error) {
      console.error("Error al obtener los sprints:", error);
    }

    setIsEmpresaOpen(false);
  };

  const handleOptionChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedSprint(selectedId);
    try {
      const response = await axios.get(`${API_URL}planificacion/${selectedEmpresa}/${selectedGestion}/${selectedId}`);
      const sprints2 = response.data[0][0].sprints;

      if (selectedId === 'Todos') {
        const sprintsArray = response.data[0].sprints;
        const allEventos = sprintsArray.flatMap((sprint) => {
          const inicio = dayjs(sprint.fecha_inicio);
          const fin = dayjs(sprint.fecha_fin);
          const color = sprint.color || '#ff0000';
          const diasHabiles = filtrarDiasHabiles(inicio, fin);
          return diasHabiles.map((fecha) => ({
            title: `Sprint ${sprint.nro_sprint}`,
            start: fecha,
            end: fecha,
            style: { backgroundColor: color },
          }));
        });
        setEventos(allEventos);
      } else {
        const sprintData = sprints2.find((sprint) => sprint.nro_sprint == parseInt(selectedId));
        if (sprintData) {
          const inicio = dayjs(sprintData.fecha_inicio);
          const fin = dayjs(sprintData.fecha_fin);
          const color = sprintData.color || '#ff0000';
          setFechaInicio(inicio);
          setFechaFinal(fin);

          const alcances = sprintData.alcances || [];
          const alcancesConTareas = alcances.map(alcance => ({
            descripcion: alcance.descripcion,
            tareas: alcance.tareas || []
          }));
          setAlcances(alcancesConTareas);

          const diasHabiles = filtrarDiasHabiles(inicio, fin);
          setEventos(
            diasHabiles.map((fecha) => ({
              title: `Sprint ${sprintData.nro_sprint}`,
              start: fecha,
              end: fecha,
              style: { backgroundColor: color },
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener los detalles del sprint:", error);
    }
    setIsSprintOpen(false);
  };

  const fetchGestionesData = async () => {
    try {
      const response = await axios.get(`${API_URL}gestiones`);
      setGestiones(response.data);
    } catch (error) {
      console.error("Error al obtener las gestiones:", error);
    }
  };

  useEffect(() => {
    fetchGestionesData();
  }, []);

  // Validación de todos los campos de la sección "Guardar"
  const validateForm = () => {
    // Validar fechas
    let error = validarFechas(fechaInicio, fechaFinal);
    if (error) { toast.error(error); return false; }

    // Validar nroSprint (numérico)
    error = validarCampoNumerico(nroSprint, 'N° Sprint');
    if (error) { toast.error(error); return false; }

    // Validar cobro (numérico)
    error = validarCampoNumerico(cobro, '% Cobro');
    if (error) { toast.error(error); return false; }

    // Validar requerimiento (texto)
    error = validarCampoTexto(requerimiento, 'Requerimiento');
    if (error) { toast.error(error); return false; }

    toast.success('Datos válidos. Procediendo con el guardado...');
    return true;
  };

  // Validación de HU-Tarea y Estimación antes de agregar tarea
  const validateTaskForm = () => {
    let error = validarCampoTexto(huTarea, 'HU-Tarea');
    if (error) { toast.error(error); return false; }

    error = validarCampoNumerico(estimacion, 'Estimación');
    if (error) { toast.error(error); return false; }

    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Aquí la lógica de guardado
      console.log("Datos guardados con éxito");
    }
  };

  const handleAddTarea = () => {
    if (validateTaskForm()) {
      const nuevaTarea = { huTarea, estimacion };
      setTareas([...tareas, nuevaTarea]);
      toast.success('HU-Tarea y Estimación agregadas correctamente');
      setHuTarea('');
      setEstimacion('');
    }
  };

  return (
    <div className="container custom-container pt-3">
      <Toaster position="top-right" />

      <div className="container">
        <div className="row">
          {/* Menú Gestión */}
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

          {/* Menú Empresa */}
          <div className="col-md-4" style={{ marginTop: '-150px' }}>
            <div className="empresa-dropdown me-5">
              <button className="btn btn-primary" onClick={toggleEmpresaDropdown}>
                Empresa <span className="arrow">{isEmpresaOpen ? '▲' : '▼'}</span>
              </button>
              {isEmpresaOpen && (
                <div className="dropdown-menu show">
                  {empresas.map((empresa) => (
                    <label className="dropdown-item" key={empresa.nombre_empresa}>
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

          {/* Menú Sprint */}
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

          {/* Calendario */}
          <div className="col-md-9" style={{ marginLeft: '148px', marginTop: '-100px', height: '360px' }}>
            <Calendar
              localizer={localizer}
              events={eventos}
              startAccessor="start"
              endAccessor="end"
              style={{ margin: '50px' }}
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
                  <Modal.Title>Detalles del {selectedEvent.title}</Modal.Title>
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

        {/* Sección para datos generales */}
        <div className="row mt-5">
          <h3>Datos a validar</h3>
          <Row className="mb-3">
            <Col md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Inicio"
                  value={fechaInicio}
                  onChange={(newValue) => setFechaInicio(newValue)}
                  renderInput={(params) => (
                    <Form.Control {...params.inputProps} value={params.inputProps?.value ?? ''} />
                  )}
                />
              </LocalizationProvider>
            </Col>
            <Col md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha Fin"
                  value={fechaFinal}
                  onChange={(newValue) => setFechaFinal(newValue)}
                  renderInput={(params) => (
                    <Form.Control {...params.inputProps} value={params.inputProps?.value ?? ''} />
                  )}
                />
              </LocalizationProvider>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Sprint (numérico)</Form.Label>
              <Form.Control
                type="text"
                value={nroSprint}
                onChange={(e) => setNroSprint(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Cobro (numérico)</Form.Label>
              <Form.Control
                type="text"
                value={cobro}
                onChange={(e) => setCobro(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Requerimiento (solo letras)</Form.Label>
              <Form.Control
                type="text"
                value={requerimiento}
                onChange={(e) => setRequerimiento(e.target.value)}
              />
            </Col>
          </Row>

          <Button variant="success" onClick={handleSave}>Guardar</Button>
        </div>

        {/* Sección para HU-Tarea y Estimación */}
        <div className="row mt-5">
          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>HU-Tarea (solo letras)</Form.Label>
              <Form.Control
                type="text"
                value={huTarea}
                onChange={(e) => setHuTarea(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Estimación (numérico)</Form.Label>
              <Form.Control
                type="text"
                value={estimacion}
                onChange={(e) => setEstimacion(e.target.value)}
              />
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleAddTarea}>+</Button>
            </Col>
          </Row>
        </div>

        {tareas.length > 0 && (
          <div className="row mt-3">
            <h4>Tareas agregadas:</h4>
            <ul>
              {tareas.map((t, i) => (
                <li key={i}>{t.huTarea} - {t.estimacion} horas</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCalendar;
