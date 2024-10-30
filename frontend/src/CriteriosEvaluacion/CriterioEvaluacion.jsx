import { API_URL } from '../config'; 
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './CriterioEvaluacion.css';

function valuetext(value) {
  return `${value}%`; // Cambiar el texto a porcentaje
}
const CriterioEvaluacion = () => {
  const initialCriterios = [];
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [criterio, setCriterio]= useState([]);
  const [filteredCriterios, setFilteredCriterios] = useState([]);
  const [currentCriterio, setCurrentCriterio] = useState(null);
  const [value, setValue] = React.useState([20, 37]);
  const [formValues, setFormValues] = useState({
    id: '',
    nombre: '',
    descripción: '',
    porcentaje: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);


  const fetchCriterios = async () => {
    try {
      const response = await axios.get(`${API_URL}criterios`);
      setCriterio(response.data);
      setFilteredCriterios(response.data);

      if (response.data.length === 0) {
        toast.error('No hay criterios registrados.');
      }
    } catch (err) {
      toast.error('Error al cargar los criterios.');
    }

  };

  useEffect(()=>{
    fetchCriterios();
  },[]);


  const handleShowModal = (criterio = null) => {
    if(criterio){
      setFormValues({
        id: criterio.id_criterio,
        nombre: criterio.nombre_criterio || '',
        descripción: criterio.descripcion||'',
        porcentaje: criterio.porcentaje,
      });
      setCurrentCriterio(criterio);
    }else{
      setFormValues({
        id: '',
        nombre: '',
        descripción: '',
        porcentaje: '',
      });
      setCurrentCriterio(null);
    }
    setShowModal(true);
  };



  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este criterio?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}criterios/${id}`);
                toast.dismiss(t.id);
                toast.success('Criterio eliminado exitosamente');
                fetchEstudiantes();
              } catch (err) {
                toast.error('Error al eliminar el criterio');
              }
            }}
            className="btn btn-danger me-2"
          >
            Sí, eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  const handleCloseModal =()=>{
    setShowModal(false);
    setFormErrors({});
    setIsSaving(false);
  };


  const handleInputChange = (eventOrValue, fieldName) => {
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
    
  };
   const [step, setStep] = useState(1);
   const handleStepChange = (event) => {
    const value = event.target.value;
    setStep(Number(value)); // Cambia el paso basado en la entrada del usuario
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const validateForm = () => {
    const errors = {};
    
    if (!/^\d+$/.test(formValues.id)) {
      errors.id = 'El id debe ser un numero';
    }
    if (/\d/.test(formValues.nombre)) {
      errors.nombre = 'El nombre no debe contener números.';
    }
    if (/\d/.test(formValues.descripción)) {
      errors.descripcion = 'La descripción no debe contener números.';
    }
    if (!/^\d+$/.test(formValues.porcentaje)) {
      errors.porcentaje = 'El número de porcentaje debe contener solo números.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSave = async ()=>{
    if (!validateForm()){
      toast.error('Por favor, revisa los errores en el formulario.');
    }

    setIsSaving(true);
    const criteriosData={
      nombre_criterio: formValues.nombre,
      descripcion: formValues.descripción,
      porcentaje: formValues.porcentaje,
    };

    const promise = currentCriterio
    ? axios.put(`${API_URL}criterios/${currentEstudiante.id_criterio}`, criteriosData)
    : axios.post(`${API_URL}criterios`, criteriosData);
    
    toast.promise(
      promise,
      {
        loading: 'Guardando...',
        success: <b>{currentCriterio ? 'Criterio editado exitosamente' : 'Criterio agregado exitosamente'}</b>,
        error: <b>Error al guardar el criterio de evaluación</b>,
      }
    );

    try {
      await promise;
      await fetchCriterios(); // Refrescamos la lista de estudiantes
      handleCloseModal();
    } catch (err) {
      toast.error('Error al guardar el criterio');
    }
  
  }

  return (
    <div className="container"style={{ transform: 'translateY(-190px)' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Criterios de Evaluación</h1>
        <div>
          <button className="btn btn-primary" onClick={() => handleShowModal()}>+ Registrar Criterio</button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Porcentaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
           {filteredCriterios.map((criterio) => (
              <tr key={criterio.id_criterio}>
                <td>{`${criterio.nombre} ${criterio.descripcion}`}</td>
                <td>{criterio.porcentaje}</td>
                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(estudiante)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(estudiante.id_estudiante)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            {/* Modal para agregar/editar criterio*/}
        <Modal show={showModal} onHide={handleCloseModal}className="custom-width-modal">
          <Modal.Body className='custom-modal'>
            <Form>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="formNombre">
                    <Form.Label>Nombre de Criterio</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre de criterio"
                      value={formValues.nombre}
                      onChange={handleInputChange}
                      placeholder="Nombre de criterio"
                      isInvalid={!!formErrors.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.nombre}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="formDescripcion">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      type="text"
                      name="descripcion"
                      value={formValues.descripción}
                      onChange={handleInputChange}
                      placeholder="Descripción"
                      isInvalid={!!formErrors.descripción}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.descripción}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={9}>
                  <Form.Label>Porcentaje de cobro</Form.Label>
                  <Box>
                    <Slider
                      getAriaLabel={() => 'Porcentaje de rango'}
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      valueLabelFormat={valuetext} // Mostrar el formato de porcentaje en la etiqueta
                      min={0} // Valor mínimo en porcentaje
                      max={100} // Valor máximo en porcentaje
                      disableSwap // Evitar que los manejadores se crucen
                    />
                  </Box>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : currentCriterio ? 'Guardar Cambios' : 'Registrar'}
          </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default CriterioEvaluacion;
