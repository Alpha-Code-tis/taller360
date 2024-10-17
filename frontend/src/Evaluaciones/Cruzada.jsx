import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FaEye, FaArrowLeft } from 'react-icons/fa'; // Importar íconos
import './Cruzada.css'; // Asegúrate de tener estilos adecuados

const Cruzada = () => {
  const [equipos, setEquipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEquipo, setCurrentEquipo] = useState(null);
  const [view, setView] = useState('equipos'); // 'equipos' o 'estudiantes'

  const [evaluated, setEvaluated] = useState({}); // Estado de los checklists
  const [evaluationDetails, setEvaluationDetails] = useState(''); // Detalles de evaluación

  // Estados para estudiantes y modal de detalles
  const [estudiantes, setEstudiantes] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTarea, setCurrentTarea] = useState(null);

  // Cargar los equipos desde el backend
  const fetchEquipos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/empresa'); // Asegúrate de que esta ruta sea correcta
      setEquipos(response.data);
    } catch (error) {
      toast.error('Error al cargar los equipos');
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []); // Ejecutar cuando el componente se monta

  // Manejar la búsqueda de equipos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrar equipos según el término de búsqueda
  const filteredEquipos = equipos.filter((equipo) =>
    equipo.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.correo_empresa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el clic en "Evaluar" en la tabla de equipos
  const handleEvaluateEquipo = async (equipo) => {
    setCurrentEquipo(equipo);
    // Obtener estudiantes del equipo seleccionado desde el backend
    try {
        console.log('ID de la empresa:', equipo.id_empresa);
      const response = await axios.get(`http://localhost:8000/api/empresa/${equipo.id_empresa}/estudiantes`);
      setEstudiantes(response.data);
      setView('estudiantes');
    } catch (error) {
      toast.error('Error al cargar los estudiantes del equipo');
    }
  };

  // Manejar el modal de detalles de la tarea
  const handleShowDetailsModal = (tarea) => {
    setCurrentTarea(tarea);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentTarea(null);
  };

  // Manejar el botón "Evaluar" en la tabla de estudiantes
  const handleEvaluateEstudiante = (estudiante) => {
    // Aquí puedes implementar la funcionalidad de evaluación del estudiante
    toast.success(`Evaluar al estudiante ${estudiante.nombre_estudiante}`);
  };

  // Volver a la vista de equipos
  const handleBackToEquipos = () => {
    setView('equipos');
    setCurrentEquipo(null);
    setEstudiantes([]);
  };

  return (
    <div className="container mt-2 pt-3">
      {view === 'equipos' ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="m-0">Evaluación Cruzada de Equipos</h1>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="table-container">
            <table className="table table-hover equipos-table">
              <thead className="table-light">
                <tr>
                  <th>Nombre del Equipo</th>
                  <th>Correo del Equipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipos.map((equipo) => (
                  <tr key={equipo.id_empresa}>
                    <td>{equipo.nombre_empresa}</td>
                    <td>{equipo.correo_empresa}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          className="me-2"
                          checked={!!evaluated[equipo.id_empresa]}
                          onChange={() => setEvaluated((prev) => ({ ...prev, [equipo.id_empresa]: !prev[equipo.id_empresa] }))}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEvaluateEquipo(equipo)}
                        >
                          Evaluar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        // Vista de estudiantes del equipo seleccionado
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Button variant="link" onClick={handleBackToEquipos}>
                <FaArrowLeft /> Volver a Equipos
              </Button>
              <h2>{currentEquipo.nombre_empresa}</h2>
            </div>
          </div>

          <div className="table-container">
            <table className="table table-hover estudiantes-table">
              <thead className="table-light">
                <tr>
                  <th>Tarea</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Progreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante) => (
                  <tr key={estudiante.id_estudiante}>
                    <td>{estudiante.tarea?.nombre_tarea || 'Sin tarea asignada'}</td>
                    <td>{`${estudiante.nombre_estudiante} ${estudiante.ap_pat} ${estudiante.ap_mat}`}</td>
                    <td>{estudiante.tarea?.estado || 'N/A'}</td>
                    <td>
                      <ProgressBar now={estudiante.tarea?.progreso || 0} label={`${estudiante.tarea?.progreso || 0}%`} />
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowDetailsModal(estudiante.tarea)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleEvaluateEstudiante(estudiante)}
                      >
                        Evaluar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal para detalles de la tarea */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTarea ? (
            <div>
              <p><strong>Nombre de la Tarea:</strong> {currentTarea.nombre_tarea}</p>
              <p><strong>Descripción:</strong> {currentTarea.descripcion}</p>
              <p><strong>Estado:</strong> {currentTarea.estado}</p>
              <p><strong>Progreso:</strong> {currentTarea.progreso}%</p>
              {/* Agrega más detalles si es necesario */}
            </div>
          ) : (
            <p>No hay detalles disponibles para esta tarea.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cruzada;
