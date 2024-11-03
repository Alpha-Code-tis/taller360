import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import './EvaluacionFinal.css';
import { Modal, Button, Form, Dropdown, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');


const EvaluacionFinal = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationDetails, setEvaluationDetails] = useState([]);
  const [formValues, setFormValues] = useState({
    descripcion_evaluacion: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEvaluationEnabled, setIsEvaluationEnabled] = useState(false);

  const handleShowDetailsClick = async (estudiante) => {
    setCurrentTask(estudiante);
    await fetchEvaluacionDetalles(estudiante.id_estudiante);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setEvaluationDetails([]);
  };

  const handleEvaluateClick = (estudiante) => {
    setCurrentTask(estudiante)
    setShowEvaluationModal(true);
    setFormValues({
      descripcion_evaluacion: '',
    });
  };

  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setSelectedEvaluation(null);
    setFormErrors({});
  };

  const fetchEvaluacionDetalles = async (idEstudiante) => {
    try {
      const response = await axios.get(`${API_URL}evaluacion_final/${idEstudiante}`);
      console.log(response.data);
      setEvaluationDetails(response.data);
    } catch (error) {
      toast.error('Error al cargar los detalles de la evaluación.');
    }
  };

  const handleSaveEvaluation = async () => {
    if (!validateForm()) {
      return;
    }
    const evaluation = {
      id_est_evaluador: localStorage.getItem('id_estudiante'),
      id_est_evaluado: currentTask.id_estudiante,
      resultado_escala: selectedEvaluation.label,
      resultado_comentario: formValues.descripcion_evaluacion,
    };
    try {
      const response = await axios.post(`${API_URL}evaluacion_final`, evaluation);
      if (response.status === 201) {
        toast.success('Evaluación realizada exitosamente');
        fetchEstudiantes();
        handleCloseEvaluationModal();
      }
    } catch (error) {
      console.error(error.response.data);
      toast.error('Error al realizar la evaluación');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedEvaluation) {
      errors.resultado_evaluacion = 'Debe seleccionar una opción de la escala.';
    }
    if (!formValues.descripcion_evaluacion.trim()) {
      errors.descripcion_evaluacion = 'La explicación es requerida';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectEvaluation = (index) => {
    setSelectedEvaluation(evaluationOptions[index]);
    setFormErrors({...formErrors, resultado_evaluacion: ''});
  };

  const evaluationOptions = [
    { value: 1, label: 'Malo', color: '#a9cce3' }, //
    { value: 2, label: 'Regular', color: '#a9cce3' }, //
    { value: 3, label: 'Aceptable', color: '#a9cce3' }, //
    { value: 4, label: 'Bueno', color: '#a9cce3' }, //
    { value: 5, label: 'Excelente', color: '#a9cce3' } //
  ];

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const fetchEstudiantes = async() => {
    try {
      const response = await axios.get(`${API_URL}listaEstudiantes`);
      const idEstudianteAuth = localStorage.getItem('id_estudiante');
      console.log('id', idEstudianteAuth);
      const estudiantes = response.data.filter(estudiante => estudiante.id_estudiante != idEstudianteAuth);
      setEstudiantes(estudiantes);
    } catch (error) {
      toast.error('Error al cargar los estudiantes.');
    }
  };

  return (
    <div className="lista-autoevaluacion-container">
      <h1 className="title">Lista de integrantes</h1>
      <table className="autoevaluacion-table">
      <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Ver detalles</th>
            <th>Evaluación</th>
          </tr>
      </thead>
          <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id_estudiante}>
              <td>{`${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`}</td>
              <td>
                <button className="view-button" onClick={() => handleShowDetailsClick(estudiante)}>👁️</button>
              </td>
              <td>
                  {estudiante.evaluado_evaluaciones_finales.length > 0
                    ? (<Badge bg="success">Evaluado</Badge>)
                    : (
                      <button className="btn btn-primary btn-sm" type="button"
                        onClick={() => handleEvaluateClick(estudiante)}>
                        Evaluar
                      </button>
                    )
                  }
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <Modal show={showEvaluationModal} onHide={handleCloseEvaluationModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{'Evaluación de ' + currentTask?.nombre_estudiante}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <div className="evaluation-options">
                {evaluationOptions.map((option, index) => (
                  <div className="evaluation-item" key={index}>
                    <button className="evaluation-circle" onClick={() => handleSelectEvaluation(index)} type="button"
                      style={{ backgroundColor: option.value === selectedEvaluation?.value ? '#0d6efd' : option.color }}>
                      {option.value}
                    </button>
                    <span className="evaluation-label">{option.label}</span>
                  </div>
                ))}
              </div>
              {formErrors.resultado_evaluacion && (
                <div className="d-block invalid-feedback">{formErrors.resultado_evaluacion}</div>
              )}
            </div>
            <Form.Group controlId="formDescripcionEvaluacion" className="mb-3">
              <Form.Label>Explica tu elección</Form.Label>
              <Form.Control
                type="text"
                name="descripcion_evaluacion"
                value={formValues.descripcion_evaluacion}
                onChange={handleInputChange}
                isInvalid={!!formErrors.descripcion_evaluacion}
              />
              <Form.Control.Feedback type="invalid">{formErrors.descripcion_evaluacion}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEvaluationModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveEvaluation }>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* para ver detalles */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{'Evaluaciones de ' + currentTask?.nombre_estudiante +' ' + currentTask?.ap_pat}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {evaluationDetails.length > 0 ? (
            evaluationDetails.map((detail, index) => (
              <div key={index}>
                <p><strong>Evaluado por:</strong> {detail.evaluador.nombre_estudiante +' ' + detail.evaluador.ap_pat +' ' + detail.evaluador.ap_mat}</p>
                <p><strong>Escala:</strong> {detail.resultado_escala}</p>
                <p><strong>Comentario:</strong> {detail.resultado_comentario}</p>
                <br/>
              </div>
            ))
          ) : (
            <p>No hay evaluaciones disponibles.</p>
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

export default EvaluacionFinal;
