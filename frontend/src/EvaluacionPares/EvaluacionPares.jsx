import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import './EvaluacionPares.css';
import { Modal, Button, Form, Dropdown, Badge } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import { DataGrid } from '@mui/x-data-grid';
import Table from 'react-bootstrap/Table';

const EvaluacionPares = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationDetails, setEvaluationDetails] = useState([]);
  const [criterios, setCriterios]= useState([]);
  const [currentCriterio, setCurrentCriterio] = useState(null);
  const [formValues, setFormValues] = useState({
    descripcion_evaluacion: '',
    nombre: '',
    descripción: '',
    porcentaje: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEvaluationEnabled, setIsEvaluationEnabled] = useState(false);
  const [sprints, setSprints] = useState([]);


  const [selectedRowsData, setSelectedRowsData] = useState([]);

  const columns = [
    { field: 'id_criterio', headerName: 'ID', width: 25, disableColumnMenu: true },
    { field: 'nombre', headerName: 'Nombre', width: 170, disableColumnMenu: true },
    { field: 'descripcion', headerName: 'Descripción', width: 150, disableColumnMenu: true },
    { field: 'porcentaje', headerName: 'Porcentaje', width: 100, disableColumnMenu: true },
  ];

  const handleSelectionChange = (selection) => {
    // Filtramos los objetos completos de las filas seleccionadas a partir de los ids seleccionados
    // const selectedData = criterios.filter((criterio) => selectionModel.includes(criterio.id_criterio));
    setSelectedRowsData(selection);
  };

  const handleShowDetailsClick = (estudiante) => {
    setCurrentStudent(estudiante);
    fetchEvaluacionDetalles(estudiante.id_estudiante);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setEvaluationDetails([]);
  };

  const handleEvaluateClick = (estudiante) => {
    setCurrentStudent(estudiante)
    setShowEvaluationModal(true);
    setFormValues({
      descripcion_evaluacion: '',
    });
  };

  const handleCloseEvaluationModal = () => {
    setShowEvaluationModal(false);
    setSelectedEvaluation(null);
    setFormErrors({});
    setSelectedRowsData([]);
  };

  const fetchEvaluacionDetalles = async (idEstudiante) => {
    try {
      const response = await axios.get(`${API_URL}evaluacionPares/${idEstudiante}?sprintId=${selectedSprint.id_sprint}`);
      setEvaluationDetails(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Error al cargar los detalles de la evaluación.');
    }
  };

  const handleSaveEvaluation = async () => {
    if (!validateForm()) {
      return;
    }
    const data = {
      criterios_ids: selectedRowsData,
      id_estudiante_evaludado: currentStudent.id_estudiante,
      id_sprint: selectedSprint.id_sprint
    }
    try {
      const response = await axios.post(`${API_URL}evaluacionPares`, data);
      if (response.status === 201) {
        toast.success('Evaluación realizada exitosamente');
        fetchEstudiantes(selectedSprint.id_sprint);
        fetchCriterios();
        handleCloseEvaluationModal();
      }
    } catch (error) {
      toast.error('Error al realizar la evaluación');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (selectedRowsData.length === 0) {
      errors.length = 'Debe seleccionar al menos un criterio antes de guardar.';
      toast.error('Debe seleccionar al menos un criterio antes de guardar.');
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

  const handleSelectSprint = (sprint) => {
    setSelectedSprint(sprint);
    fetchEstudiantes(sprint.id_sprint);
  };

  const evaluationOptions = [
    { value: 1, label: 'Malo', color: '#a9cce3' }, //
    { value: 2, label: 'Regular', color: '#a9cce3' }, //
    { value: 3, label: 'Aceptable', color: '#a9cce3' }, //
    { value: 4, label: 'Bueno', color: '#a9cce3' }, //
    { value: 5, label: 'Excelente', color: '#a9cce3' } //
  ];

  useEffect(() => {
    // fetchEstudiantes();
    fetchCriterios();
    fetchSprints();
  }, []);

  const fetchEstudiantes = async(sprintId) => {
    try {
      const response = await axios.get(`${API_URL}listaEstudiantes?sprintId=${sprintId}`);
      const idEstudianteAuth = localStorage.getItem('id_estudiante');
      const estudiantes = response.data.filter(estudiante => estudiante.id_estudiante != idEstudianteAuth);
      setEstudiantes(estudiantes);
    } catch (error) {
      toast.error('Error al cargar los estudiantes.');
    }
  };
  const fetchCriterios = async () => {
    try {
      const response = await axios.get(`${API_URL}criterios`);
      const criteriosData = response.data;
      if (criteriosData.length === 0) {
        toast.error('No hay criterios registrados.'), {id: 'fetchCriterios'};
      }else{
        setCriterios(criteriosData);
        console.log('çriterios', criteriosData);
      }
    } catch (err) {
      toast.error('Error al cargar los criterios.');
    }

  };
  const fetchSprints = async () => {
    try {
      const response = await axios.get(`${API_URL}tareas/sprints`);
      setSprints(response.data);
    } catch (error) {
      toast.error('Error al cargar los sprints.');
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-2">
        <h1 className="title">Evaluación Entre Pares</h1>
        <Dropdown>
          <Dropdown.Toggle>
            Sprint {selectedSprint?.nro_sprint}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {sprints.map((sprint, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelectSprint(sprint)}>Sprint {sprint.nro_sprint}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <table className="table table-hover autoevaluacion-table">
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
                  {estudiante.evaluado_criterios.length > 0
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

      <Modal show={showEvaluationModal} onHide={handleCloseEvaluationModal} centered size="lg" dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{'Evaluación de ' + currentStudent?.nombre_estudiante}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={criterios}
                columns={columns}
                getRowId={(row) => row.id_criterio}
                checkboxSelection
                onRowSelectionModelChange={handleSelectionChange}
                hideFooter
              />
            </div>
              {formErrors.resultado_evaluacion && (
                <div className="d-block invalid-feedback">{formErrors.resultado_evaluacion}</div>
              )}
            </div>
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
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered >
        <Modal.Header closeButton>
          <Modal.Title>{'Evaluaciones de ' + currentStudent?.nombre_estudiante +' ' + currentStudent?.ap_pat}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Porcentaje</th>
                <th>Estudiante Evaluador</th>
              </tr>
            </thead>
            <tbody>
              {evaluationDetails.length > 0 ? (
                evaluationDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.nombre}</td>
                    <td>{detail.descripcion}</td>
                    <td>{detail.porcentaje}</td>
                    <td>{`${detail.estudiante_evaluador.nombre_estudiante} ${detail.estudiante_evaluador.ap_pat} ${detail.estudiante_evaluador.ap_mat}`}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4'>No hay evaluaciones disponibles.</td>
                </tr>
              )}

            </tbody>
          </Table>
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

export default EvaluacionPares;
