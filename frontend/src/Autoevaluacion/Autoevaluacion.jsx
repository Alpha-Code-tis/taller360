import React, { useState, useEffect } from 'react';
import './Autoevaluacion.css';
import { Modal, Button, Form, Dropdown, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const Autoevaluacion = () => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({
    descripcion_evaluacion: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleSelectSprint = (sprint) => {
    const initDay = dayjs(sprint.fecha_inicio).format('DD');
    const initMonth = dayjs(sprint.fecha_inicio).format('MMMM');
    const initYear = dayjs(sprint.fecha_inicio).format('YYYY');
    const endDay = dayjs(sprint.fecha_fin).format('DD');
    const endMonth = dayjs(sprint.fecha_fin).format('MMMM');
    const endYear = dayjs(sprint.fecha_fin).format('YYYY');
    sprint.formatDate = `del ${initDay} de ${initMonth} de ${initYear} al ${endDay} de ${endMonth} de ${endYear}`;
    setSelectedSprint(sprint);
    fetchTasks(sprint.id_sprint);
  };
  const handleEvaluateClick = (task) => {
    setCurrentTask(task)
    setShowModal(true);
    setFormValues({
      descripcion_evaluacion: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvaluation(null);
    setFormErrors({});
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    const evaluation = {
      resultado_evaluacion: selectedEvaluation.label,
      descripcion_evaluacion: formValues.descripcion_evaluacion,
    };
    try {
      await axios.patch(`http://localhost:8000/api/autoevaluacion/${currentTask.id_tarea}`, evaluation);
      toast.success('Autoevaluación realizada exitosamente');
      fetchTasks(selectedSprint.id_sprint);
      handleCloseModal();
    } catch (err) {
      toast.error('Error al realizar la autoevaluación');
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

  useEffect(() => {
    fetchSprints();
  }, []);

  const fetchSprints = async() => {
    try {
      const response = await axios.get('http://localhost:8000/api/tareas/sprints');
      setSprints(response.data);
    } catch (error) {
      toast.error('Error al cargar los sprints.');
    }
  };

  const fetchTasks = async(sprintId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tareas/${sprintId}`);
      setTasks(response.data);
    } catch (error) {
      toast.error('Error al cargar las tareas.');
    }
  };

  const evaluationOptions = [
    { value: 1, label: 'Malo', color: '#a9cce3' }, //
    { value: 2, label: 'Regular', color: '#a9cce3' }, //
    { value: 3, label: 'Aceptable', color: '#a9cce3' }, //
    { value: 4, label: 'Bueno', color: '#a9cce3' }, //
    { value: 5, label: 'Excelente', color: '#a9cce3' } //
  ];

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
        <h1 className="title">Autoevaluación de las tareas completadas</h1>
        <Dropdown>
          <Dropdown.Toggle>
            Sprint
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sprints.map((sprint, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelectSprint(sprint)}>Sprint {sprint.nro_sprint}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {selectedSprint && (
        <div className="mb-4 text-start">
          Sprint {selectedSprint.nro_sprint}, {selectedSprint.formatDate}
        </div>
      )}

      <div className="autoevaluacion-container">
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-item" key={task.id_tarea}>
              <div className="row">
                <div className="col vertical-center">
                  <span>{task.nombre_tarea}</span>
                </div>
                <div className="col">
                  {task.pivot.resultado_evaluacion
                    ? (<Badge bg="success">Evaluado</Badge>)
                    : (
                      <button className="btn btn-primary btn-sm" type="button"
                        onClick={() => handleEvaluateClick(task)}>
                        Evaluar
                      </button>
                    )
                  }

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{'Autoevaluación de Tarea ' + currentTask?.nombre_tarea}</Modal.Title>
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

export default Autoevaluacion;
