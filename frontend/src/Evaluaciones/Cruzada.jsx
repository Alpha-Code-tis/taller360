import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Dropdown, Spinner, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import './Cruzada.css';

const Cruzada = () => {
  const [equipos, setEquipos] = useState([]);
  const [currentEquipo, setCurrentEquipo] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [criterios, setCriterios] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedTarea, setSelectedTarea] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null); // Estudiante seleccionado
  const [tareas, setTareas] = useState([]);

  // Función para calcular el porcentaje por botón como número entero
  const getButtonPercentage = (criterioPorcentaje, buttonNumber) => {
    return Math.round((criterioPorcentaje / 5) * buttonNumber);
  };

  // Obtener la lista de equipos
  const fetchEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const response = await axios.get(`${API_URL}equipos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      setEquipos(response.data);
    } catch (error) {
      toast.error('Error al cargar los equipos');
      console.error('Error al cargar los equipos:', error);
    } finally {
      setLoadingEquipos(false);
    }
  };

  const fetchUsuarioAutenticado = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/usuario', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      return response.data.equipo_id; // Suponiendo que el backend devuelve el equipo del usuario
    } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
      toast.error('Error al obtener la información del usuario.');
      return null;
    }
  };

  // Cargar las tareas cuando se selecciona un equipo
  const fetchTareas = async (equipo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No estás autenticado. Por favor, inicia sesión.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/tareas/tareasEmpresa/${equipo.id_empresa}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const tareasConEvaluacion = response.data.map((tarea) => ({
        ...tarea,
        evaluada: tarea.estudiantes.some((estudiante) => estudiante.evaluado), // Campo que indica si está evaluado
      }));

      setTareas(tareasConEvaluacion);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('No autenticado. Por favor, inicia sesión nuevamente.');
          navigate('/login');
        } else {
          console.error('Error en la respuesta del servidor:', error.response.data);
          toast.error(`Error ${error.response.status}: ${error.response.data.message || 'al cargar las tareas'}`);
        }
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        toast.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error al configurar la solicitud:', error.message);
        toast.error('Error al configurar la solicitud');
      }
    }
  };

  // Obtener los criterios asociados a una tarea específica desde el backend
  const fetchCriterios = async (tareaId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/criterios/tarea/${tareaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });
      if (Array.isArray(response.data)) {
        setCriterios(response.data);
        console.log('Criterios cargados:', response.data);
      } else {
        setCriterios([]);
        console.error('La respuesta de criterios no es un array:', response.data);
      }
    } catch (error) {
      setCriterios([]);
      toast.error('Error al cargar los criterios');
      console.error('Error al cargar los criterios:', error);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  // Manejar la selección de un equipo desde el dropdown
  const handleSelectEquipo = (equipo) => {
    console.log("Equipo seleccionado:", equipo);
    setCurrentEquipo(equipo);
    fetchEstudiantes(equipo);
    fetchTareas(equipo);
  };

  // Obtener los estudiantes para el equipo seleccionado
  const fetchEstudiantes = async (equipo) => {
    setLoadingEstudiantes(true);

    try {
      // Obtén el equipo del usuario autenticado
      const equipoUsuario = await fetchUsuarioAutenticado();

      const response = await axios.get(`http://localhost:8000/api/cruzada/empresas/${equipo.id_empresa}/estudiantes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      });

      // Filtra los estudiantes del equipo actual que no pertenezcan al equipo del usuario
      const estudiantesFiltrados = response.data.filter(
        (estudiante) => estudiante.id_equipo !== equipoUsuario
      );

      setEstudiantes(estudiantesFiltrados);
    } catch (error) {
      toast.error('Error al cargar los estudiantes del equipo');
      console.error('Error al cargar los estudiantes del equipo:', error);
    } finally {
      setLoadingEstudiantes(false);
    }
  };

  // Abrir el modal y cargar los criterios para la tarea seleccionada
  const handleOpenModal = (tarea, estudiante) => {
    if (!tarea || !tarea.id_tarea) {
      console.error("La tarea seleccionada es inválida:", tarea);
      toast.error("No se ha seleccionado una tarea válida.");
      return;
    }

    setSelectedTarea(tarea);
    setSelectedEstudiante(estudiante); // Asigna el estudiante seleccionado
    fetchCriterios(tarea.id_tarea);
    setShowModal(true);
  };

  // Cerrar el modal y limpiar los estados relacionados
  const handleCloseModal = () => {
    setShowModal(false);
    setFeedback('');
    setRatings({});
    setSelectedEstudiante(null); // Limpiar el estudiante seleccionado al cerrar el modal
  };

  // Manejar el cambio de rating para un criterio específico
  const handleRatingChange = (criterioId, value) => {
    const criterio = criterios.find((c) => c.id_criterio === criterioId);
    const adjustedRating = getButtonPercentage(criterio.porcentaje, value);

    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterioId]: adjustedRating, // Guardamos el valor ajustado
    }));
  };

  // Función para guardar la evaluación
  const handleSave = async () => {
    const nota = Object.values(ratings).reduce((total, rating) => total + rating, 0);

    if (nota === 0) {
      toast.error('Debes asignar una puntuación a cada criterio antes de guardar.');
      return;
    }

    if (!selectedEstudiante) {
      toast.error('Debes seleccionar un estudiante para la evaluación.');
      return;
    }

    try {
      const evaluacionData = {
        tarea_id: selectedTarea?.id_tarea,
        feedback: feedback,
        nota: nota,
        id_empresa: currentEquipo?.id_empresa,
        id_estudiante: selectedEstudiante.id_estudiante,
        criterios: Object.keys(ratings).map((criterioId) => ({
          criterio_id: criterioId,
          valor: ratings[criterioId],
        })),
      };

      await axios.post('http://localhost:8000/api/autoevaluacion/evaluaciones', evaluacionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Evaluación guardada exitosamente.');

      // Actualizar el estado para reflejar que la tarea fue evaluada
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id_tarea === selectedTarea.id_tarea
            ? { ...tarea, evaluada: true }
            : tarea
        )
      );

      handleCloseModal();
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : error.response?.data?.message || 'Error desconocido.';
      toast.error(`Error al guardar la evaluación: ${errorMessage}`);
      console.log('Error al guardar la evaluación:', error);
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Evaluación Cruzada de Equipos</h1>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {currentEquipo ? currentEquipo.nombre_empresa : 'Equipos a Evaluar'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {equipos.map((equipo) => (
              <Dropdown.Item key={equipo.id_empresa} onClick={() => handleSelectEquipo(equipo)}>
                {equipo.nombre_empresa}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {loadingEquipos && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Cargando equipos...</span>
        </div>
      )}
      {currentEquipo && (
        <div className="mt-4">
          <h2>{currentEquipo.nombre_empresa}</h2>
          <div className="table-container">
            {loadingEstudiantes ? (
              <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Cargando estudiantes...</span>
              </div>
            ) : (
              <table className="table-hover tasks-table estudiantes-table">
                <thead className="table-light">
                  <tr>
                    <th>Tarea</th>
                    <th>Responsable</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tareas.map((tarea) =>
                    tarea.estudiantes && tarea.estudiantes.length > 0 ? (
                      tarea.estudiantes.map((estudiante) => (
                        <tr key={`${tarea.id_tarea}-${estudiante.id_estudiante}`}>
                          <td>{tarea.nombre_tarea}</td>
                          <td>
                            {estudiante.nombre_estudiante} {estudiante.ap_pat} {estudiante.ap_mat}
                          </td>
                          <td>{tarea.estado}</td>
                          <td>
                            {estudiante.id_equipo === currentEquipo.id_equipo ? (
                              <Button variant="danger" size="sm" disabled>
                                No permitido
                              </Button>
                            ) : (
                              tarea.evaluada ? (
                                <Button variant="success" size="sm" disabled>
                                  Evaluado
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleOpenModal(tarea, estudiante)}
                                >
                                  Evaluar
                                </Button>
                              )
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={tarea.id_tarea}>
                        <td>{tarea.nombre_tarea}</td>
                        <td>No asignado</td>
                        <td>{tarea.estado}</td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => handleOpenModal(tarea, null)}>
                            Evaluar
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      {/* Modal para evaluación */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Evaluar Tarea: {selectedTarea?.nombre_tarea}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {criterios.length > 0 ? (
            criterios.map((criterio) => (
              <div key={criterio.id_criterio} className="mb-4">
                <h5 className="text-center mb-3">
                  {criterio.nombre} ({criterio.porcentaje}%)
                </h5>
                <p className="text-center mb-3">{criterio.descripcion}</p>
                <div className="d-flex justify-content-center mb-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={ratings[criterio.id_criterio] === getButtonPercentage(criterio.porcentaje, value) ? 'dark' : 'light'}
                      onClick={() => handleRatingChange(criterio.id_criterio, value)}
                      className="mx-1"
                    >
                      {getButtonPercentage(criterio.porcentaje, value)}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No hay criterios disponibles para esta tarea.</p>
          )}
          <Form.Group className="mt-3">
            <Form.Label>Comentarios adicionales</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Explique brevemente su evaluación"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cruzada;
