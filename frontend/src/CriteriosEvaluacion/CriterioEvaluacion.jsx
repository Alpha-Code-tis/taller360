import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
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
  const [value, setValue] = React.useState([0, 20]);

  const [formValues, setFormValues] = useState({
    nombre: '',
    descripción: '',
    porcentaje: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const[nextId, setNextId] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const fetchCriterios = async () => {
    try {
      const response = await axios.get(`${API_URL}criterios`);
      console.log(response.data);
      const criteriosData = response.data;
      setCriterio(criteriosData);
      setFilteredCriterios(criteriosData);

      // Establecer el siguiente ID temporal para nuevos criterios
      const lastId = criteriosData.length > 0 ? criteriosData[criteriosData.length - 1].id : 0;
      setNextId(lastId + 1);

      if (criteriosData.length === 0) {
        toast.error('No hay criterios registrados.');
      }else{
        setCriterio(criteriosData);
        setFilteredCriterios(criteriosData);

        // Establecer el siguiente ID basado en el último criterio
        const lastId = criteriosData[criteriosData.length - 1]?.id || 0; // Obtén el último ID
        setNextId(lastId + 1); // Incrementa para el siguiente ID
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
        id: criterio.id,
        nombre: criterio.nombre || '',
        descripción: criterio.descripcion||'',
        porcentaje: criterio.porcentaje,
      });
      setCurrentCriterio(criterio);
      setValue([criterio.porcentaje_inicial || 0, criterio.porcentaje_final || 20]);
    }else{
      setFormValues({
        id: nextId,
        nombre: '',
        descripción: '',
        porcentaje: '',
      });
      setCurrentCriterio(null);
      setValue([0,20]);
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
                fetchCriterios();
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

  const handleInputChange = (event) => {

      const { name, value, type } = event.target;
      const newValue = type === 'number' ? Number(value) : value;
    
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: newValue,
      }));
    };

   const [step, setStep] = useState(1);
   const handleStepChange = (event) => {
    const value = event.target.value;
    setStep(Number(value)); // Cambia el paso basado en la entrada del usuario
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Guardar el valor final del porcentaje en el formulario
    setFormValues((prevValues) => ({
      ...prevValues,
      porcentaje: newValue[1] - newValue[0],  // Calcular la diferencia como porcentaje final
    }));
  };
  
  
  const validateForm = () => {
    const errors = {};
    const regexNombreDescripcion = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,\.]{5,80}$/;
    console.log('Validando formulario con valores:', formValues);
  
    if (!formValues.nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    } else if (!regexNombreDescripcion.test(formValues.nombre)) {
      errors.nombre = 'El nombre debe contener entre 5 y 80 letras, sin números ni caracteres especiales.';
    }
  
    if (!formValues.descripción) {
      errors.descripción = 'La descripción es obligatoria.';
    } else if(!regexNombreDescripcion.test(formValues.descripción)) {
      errors.descripción = 'La descripción debe contener entre 5 y 80 letras, sin números ni caracteres especiales.';
    }

    if (formValues.porcentaje < 0 || formValues.porcentaje > 100) {
      errors.porcentaje = 'El porcentaje debe estar entre 0 y 100.';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSave = async ()=>{
    const isValid = validateForm();
    console.log("¿Es válido?", isValid);
    if (!isValid) {
      return;
    }
    setIsSaving(false);

    const criteriosData={
      nombre: formValues.nombre,
      descripcion: formValues.descripción,
      porcentaje: value[1]-value[0],
    };


    const promise = currentCriterio
    ? axios.put(`${API_URL}criterios/${currentCriterio.id_criterio}`, criteriosData)
    : axios.post(`${API_URL}criterios`, criteriosData);

    toast.promise(
      promise,
      {
        loading: 'Guardando...',
        success: <b>{currentCriterio ? 'Criterio editado exitosamente' : 'Criterio agregado exitosamente'}</b>,
        error: <b>Error al guardar criterio</b>,
      }
    );

    try {
      await promise;
      await fetchCriterios(); // Refrescamos la lista de criterios
      handleCloseModal();
    } catch (err) {
      console.error(err.response.data);

      // Mostrar mensaje específico de error si la suma de porcentajes supera 100
      if (err.response?.status === 422 && err.response.data.message === 'La suma de los porcentajes no puede superar 100.') {
        toast.error('La suma de los porcentajes no puede superar 100.');
      } else {
        toast.error('Error al guardar el criterio');
      }
    }

  };

  // Calcular el total de porcentajes
const totalPorcentaje = filteredCriterios.reduce(
  (acc, criterio) => acc + parseFloat(criterio.porcentaje),
  0
);
  return (
    <div className="container"style={{ transform: 'translateY(-190px)', marginTop: '230px' }}>
      <div className="justify-content-between align-items-center mb-3">
        <h1 className="m-0">Criterios de Evaluación</h1>
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => handleShowModal()}>+ Registrar Criterio</button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      <div className="table-container1">
        <table className="table table-hover criterios-table">
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
           {filteredCriterios.map((criterio,index) => (
              <tr key={criterio.id_criterio ||criterio.id}>
                <td>{criterio.id || index + nextId}</td>
                <td>{criterio.nombre}</td>
                <td>{criterio.descripcion}</td>
                <td>{criterio.porcentaje}%</td>
                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(criterio)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(criterio.id_criterio)}>
                    <FaTrash />
                  </button>
                </td>
                {/* Fila del total */}
              </tr>
            ))}
                {/* Fila del total */}
            <tr>
              <td colSpan="3" className="text-end fw-bold">Total</td>
              <td
                style={{ color: totalPorcentaje == 100 ? 'green' : 'inherit', fontWeight: 'bold' }}
              >
                {totalPorcentaje}%
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

            {/* Modal para agregar/editar criterio*/}
        <Modal className = "modal modal-custom" show={showModal} onHide={handleCloseModal} centered>
          <Modal.Body className='custom-modal'>
            <Form>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="formNombre">
                    <Form.Label>Nombre de Criterio</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
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
                      name="descripción"
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
