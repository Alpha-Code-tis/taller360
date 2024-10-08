import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseDate } from "@internationalized/date";
import './Planificacion.css';
import { useDateFormatter } from "@react-aria/i18n";
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const Planificacion = () => {
  const initialTareas = [];
  const [error, setError] = useState(null);
  let formatter = useDateFormatter({ dateStyle: "long" });
  const [currentTareas, setCurrentTareas] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [value, setValue] = React.useState(dayjs());
  const [myEventsList, setMyEventsList] = useState([]);
  const [hu, setHu] = useState(initialTareas);
  const [fechaInicio, setFechaInicio] = useState(dayjs());
  const [fechaFinal, setFechaFinal] = useState(dayjs());
  const [formValues, setFormValues] = useState({
    tarea: '',
  });

  const [showModal, setShowModal] = useState(false);
  const handleSave = async () => {
    const loadingToastId = toast.loading('Cargando datos...');
    try {
      const response = await axios.post('http://localhost:8000/api/planificacion', {
        nro_sprint: formValues.nSprint,
        color: formValues.color,
        fecha_inicio: formValues.fechaInicio,
        fecha_fin: formValues.fechaFinal,
        alcance: formValues.alcance,
        tareas: hu.map(tarea => ({ nombre: tarea.tarea })),
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
      alcance: '',
      color: '',
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
      if (startDate.isSameOrAfter(endDate)) {
        errors.fechaFinal = 'La fecha de fin debe ser posterior a la fecha de inicio.';
      }
    }

    if (/\d/.test(formValues.alcance)) {
      errors.alcance = 'El alcance no debe contener números.';
    }
    if (!/^\d+$/.test(formValues.nSprint)) {
      errors.nSprint = 'El grupo debe contener solo números.';
    }
    if (/\d/.test(formValues.tarea)) {
      errors.tarea = 'El alcance no debe contener números.';

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    }
  }

  const handleAddTarea = () => {
    if (formValues.tarea.trim() !== '') { // Asegúrate de que el campo no esté vacío
      const newTarea = {
        id: hu.length + 1, // Genera un ID único (puedes mejorarlo más adelante)
        tarea: formValues.tarea,
      };
      setHu((prevHu) => [...prevHu, newTarea]); // Agrega la nueva tarea
      setFormValues({ ...formValues, tarea: '' }); // Limpia el campo de entrada

      // Cambiar a la última página si hay más elementos que la página actual
      if (currentPage < Math.ceil(hu.length / itemsPerPage)) {
        setCurrentPage(Math.ceil((hu.length + 1) / itemsPerPage));
      }

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
  return (
    <div className="container custom-container pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Planificación</h1>
        <button className="btn btn-primary" onClick={() => handleShowModal()}>Registrar</button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div style={{ height: '350px' }}>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '5px' }}
        />
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size='lg'>
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
                          fechaInicio: dayjs(newValue).format('DD/MM/YYYY'), // Actualiza formValues con el valor de la fecha en formato adecuado
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
              <Col md={4}>
                <Form.Group controlId="formAlcance">
                  <Form.Label>Alcance</Form.Label>
                  <Form.Control
                    type="text"
                    name="alcance"
                    value={formValues.alcance}
                    onChange={handleInputChange}
                    placeholder="Alcance"
                    isInvalid={!!formErrors.alcance}
                  />
                  {formErrors.alcance && <div className="text-danger">{formErrors.alcance}</div>}
                </Form.Group>
              </Col>

              <Col md={5}>
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

              <Col md={3} style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '31px' }}>
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
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>

                      {currentItems.length > 0 ? (
                        currentItems.map((tarea) => (
                          <tr key={tarea.id}>
                            <td>{tarea.tarea}</td>
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
              disabled={currentPage === totalPages ||hu.length <= itemsPerPage}
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
