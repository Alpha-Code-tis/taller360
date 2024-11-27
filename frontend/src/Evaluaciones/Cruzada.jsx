import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, Spinner, Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import './Cruzada.css';

const Cruzada = () => {
  const [equipos, setEquipos] = useState([]); // Equipos asignados para evaluar
  const [currentEquipo, setCurrentEquipo] = useState(null); // Equipo seleccionado
  const [criterios, setCriterios] = useState([]); // Criterios de evaluación
  const [evaluaciones, setEvaluaciones] = useState({}); // Evaluaciones asignadas a los criterios
  const [totalNota, setTotalNota] = useState(0); // Suma total de las evaluaciones
  const [driveLink, setDriveLink] = useState(''); // Enlace de Google Drive del equipo seleccionado
  const [especificaciones, setEspecificaciones] = useState(''); // Especificaciones del equipo seleccionado
  const [modalVisible, setModalVisible] = useState(false); // Control del modal para subir datos
  const [newDriveLink, setNewDriveLink] = useState(''); // Enlace de Google Drive para subir
  const [newEspecificaciones, setNewEspecificaciones] = useState(''); // Especificaciones para subir
  const [loading, setLoading] = useState(false);
  const [fechaInicioCruzada, setFechaInicioCruzada] = useState(null);
  const [fechaFinCruzada, setFechaFinCruzada] = useState(null);
  const [puedeEvaluar, setPuedeEvaluar] = useState(false);

  const [modalNotasVisible, setModalNotasVisible] = useState(false); // Control del modal de notas
  const [notasDetalle, setNotasDetalle] = useState([]); // Detalles de notas del equipo seleccionado

  // Obtener los equipos asignados para evaluar
  const fetchEquiposCruzada = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}cruzada/equipos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEquipos(response.data); // Guardar equipos asignados
    } catch (error) {
      console.error('Error al obtener los equipos:', error.response?.data || error.message);
      toast.error('Error al cargar los equipos asignados para evaluar');
    } finally {
      setLoading(false);
    }
  };


  // Guardar enlace del Drive y especificaciones
  const guardarDriveYEspecificaciones = async () => {
    if (!newDriveLink) {
      toast.error('El enlace de Google Drive no puede estar vacío');
      return;
    }

    try {
      await axios.post(
        `${API_URL}empresa/subir`,
        {
          drive_link: newDriveLink,
          especificaciones: newEspecificaciones,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Enlace de Drive y especificaciones guardados correctamente');
      setDriveLink(newDriveLink);
      setEspecificaciones(newEspecificaciones);
      setModalVisible(false); // Cerrar modal tras guardar
    } catch (error) {
      console.error('Error al guardar los datos:', error.response?.data || error.message);
      toast.error('Error al guardar el enlace de Drive y especificaciones');
    }
  };

  const fetchFechasCruzada = async () => {
    try {
      const response = await axios.get(`${API_URL}ajustes`);
      const data = response.data;
  
      setFechaInicioCruzada(data.fecha_inicio_eva_cruzada);
      setFechaFinCruzada(data.fecha_fin_eva_cruzada);
  
      // Verificar si la fecha actual está dentro del rango
      const fechaActual = new Date();
      const fechaInicio = new Date(data.fecha_inicio_eva_cruzada);
      const fechaFin = new Date(data.fecha_fin_eva_cruzada);
  
      if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
        setPuedeEvaluar(true);
      } else {
        setPuedeEvaluar(false);
      }
    } catch (error) {
      console.error('Error al obtener las fechas de evaluación cruzada:', error);
      toast.error('Error al obtener las fechas de evaluación cruzada.');
    }
  };
  
  const guardarEvaluacion = async () => {
    if (totalNota > 100) {
      toast.error('La nota total no puede exceder el 100%');
      return;
    }

    // Preparar el detalle de notas
    const detalleNotas = Object.entries(evaluaciones).map(([criterioId, nota]) => ({
      id_criterio: parseInt(criterioId, 10),
      nota,
    }));

    try {
      await axios.post(
        `${API_URL}cruzada/guardar-nota`,
        {
          equipo_evaluado_id: currentEquipo?.id_empresa, // Solo enviar el ID del equipo evaluado
          nota_cruzada: totalNota,
          detalle_notas: detalleNotas, // Enviar el detalle de notas
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Evaluación guardada correctamente');

      // Eliminar el equipo evaluado del estado
      setEquipos((prevEquipos) =>
        prevEquipos.filter((equipo) => equipo.id_empresa !== currentEquipo?.id_empresa)
      );

      // Limpiar los estados relacionados
      setCurrentEquipo(null);
      setTotalNota(0);
      setEvaluaciones({});
      setCriterios([]);
      setDriveLink('');
      setEspecificaciones('');
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error al guardar la evaluación.');
      }
      console.error(error);
    }
  };


  // Obtener las notas asignadas al equipo seleccionado
  const fetchNotasDetalle = async () => {
    try {
      const response = await axios.get(`${API_URL}cruzada/mis-notas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setNotasDetalle(response.data); // Guardar las notas asignadas
      setModalNotasVisible(true); // Mostrar modal
    } catch (error) {
      console.error('Error al cargar detalles de las notas:', error.response?.data || error.message);
      toast.error('Error al cargar los detalles de las notas');
    }
  };


  // Manejar la selección de un equipo desde el dropdown
  const handleSelectEquipo = async (equipo) => {
    setCurrentEquipo(equipo);

    try {
      const response = await axios.get(`${API_URL}empresa/detalle/${equipo.id_empresa}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Asignar datos al estado
      setDriveLink(response.data.drive_link || '');
      setEspecificaciones(response.data.especificaciones || '');
      setCriterios(response.data.criterios || []);
    } catch (error) {
      console.error('Error al cargar detalles del equipo:', error.response?.data || error.message);
      toast.error('Error al cargar los detalles del equipo');
      setDriveLink('');
      setEspecificaciones('');
      setCriterios([]);
    }
  };


  useEffect(() => {
    fetchFechasCruzada();
    fetchEquiposCruzada();
  }, []);

  // Manejar cambios en la evaluación de un criterio
  const handleEvaluationChange = (criterioId, value) => {
    const criterio = criterios.find((c) => c.id_criterio === criterioId);

    if (!criterio) {
      toast.error('Criterio no encontrado');
      return;
    }

    const maxValue = criterio?.porcentaje || 0;

    if (value > maxValue) {
      toast.error(`No puedes asignar más de ${maxValue}% para este criterio`);
      return;
    }

    setEvaluaciones((prev) => ({ ...prev, [criterioId]: value }));
    const newTotal = Object.values({ ...evaluaciones, [criterioId]: value }).reduce((acc, val) => acc + val, 0);
    setTotalNota(newTotal);
  };


  return (
    <div className="container mt-0">
    {!puedeEvaluar ? (
      <div className="alert alert-warning text-center">
        Aún no es posible evaluar a otros equipos.
      </div>
    ) : (
     <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Evaluación Cruzada de Equipos</h1>
        <div className="d-flex align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {currentEquipo ? currentEquipo.nombre_empresa : 'Selecciona un equipo'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {equipos.map((equipo) => (
                <Dropdown.Item
                  key={equipo.id_empresa}
                  onClick={() => handleSelectEquipo(equipo)}
                >
                  {equipo.nombre_empresa}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button className="ms-3" onClick={() => setModalVisible(true)}>
            Subir Enlace y Especificaciones
          </Button>
          <Button className="ms-3" onClick={fetchNotasDetalle}>
            Detalles de Notas
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando equipos...</p>
        </div>
      ) : ( 
        <Row>
          <Col md={8}>
            <Table bordered hover className="text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Criterio</th>
                  <th>Porcentaje Máximo</th>
                  <th>Evaluación</th>
                </tr>
              </thead>
              <tbody>
                {criterios.map((criterio, index) => (
                  <tr key={criterio.id_criterio}>
                    <td>{index + 1}</td>
                    <td>{criterio.nombre}</td>
                    <td>{criterio.porcentaje}%</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        max={criterio.porcentaje}
                        value={evaluaciones[criterio.id_criterio] || ''}
                        onChange={(e) =>
                          handleEvaluationChange(criterio.id_criterio, parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Enlace de Google Drive</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control type="text" readOnly value={driveLink} placeholder="No disponible" />
                {driveLink && (
                  <Button variant="link" href={driveLink} target="_blank" className="ms-2">
                    Ver
                  </Button>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Especificaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                readOnly
                value={especificaciones}
                placeholder="No disponible"
              />
            </Form.Group>

            <div className="text-center mt-4">
              <h3>Total Evaluación: {totalNota}%</h3>
              <Button variant="primary" onClick={guardarEvaluacion} disabled={totalNota === 0 || !puedeEvaluar}>
                Guardar Evaluación
              </Button>
            </div>
          </Col>
        </Row>
      
      )}
 </>
 )}
      {/* Modal para subir datos */}
      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subir Enlace y Especificaciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enlace de Google Drive</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa el enlace de Google Drive"
              value={newDriveLink}
              onChange={(e) => setNewDriveLink(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Especificaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Ingresa las especificaciones adicionales"
              value={newEspecificaciones}
              onChange={(e) => setNewEspecificaciones(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarDriveYEspecificaciones}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para detalles de notas */}
      <Modal show={modalNotasVisible} onHide={() => setModalNotasVisible(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Notas Asignadas a Tu Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notasDetalle.length === 0 ? (
            <p>No hay notas disponibles para tu equipo.</p>
          ) : (
            notasDetalle.map((evaluacion, index) => (
              <div key={index} className="mb-4">
                <h5>Evaluador: {evaluacion.evaluador}</h5>
                <Table bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Criterio</th>
                      <th>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluacion.detalles.map((nota, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{nota.criterio_nombre}</td>
                        <td>{nota.nota}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="2">
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{evaluacion.nota_total}</strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalNotasVisible(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Cruzada;
