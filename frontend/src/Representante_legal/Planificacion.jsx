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

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const Planificacion = () => {

  const initialTareas = [
    { id: 1, tarea: 'Registrar docentes'},
    { id: 2, tarea: 'Edición de datos de docente'},
    { id: 3, tarea: 'Eliminación de docente'},
    { id: 4, tarea: 'Asignación de clases' },
    { id: 5, tarea: 'Evaluación de desempeño' },
    { id: 6, tarea: 'Actualización de horarios' },
  ];

  const [error, setError] = useState(null);
  let formatter = useDateFormatter({ dateStyle: "long" });
  const[currentTareas, setCurrentTareas] = useState(null);
  const [value, setValue] = React.useState(dayjs('2022-04-17'));
  const [myEventsList, setMyEventsList] = useState([]); 
  const [hu, setHu] = useState(initialTareas);
  const [selectedDate, setSelectedDate] = useState(dayjs()); 
  const [formValues, setFormValues] = useState({
    tarea: '',
    nSprint: '',
    alcance: '',
    color: '',
    fechaInicio:'',
    fechaFinal:'',
  });

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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


  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
   // Estado para la paginación
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 3;

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = hu.slice(indexOfFirstItem, indexOfLastItem);
  
   const handleEdit = (tarea) => {
    console.log('Editando tarea:', tarea);
    setCurrentTareas(tarea);
    setFormValues({
        tarea: tarea.tarea || '',  // Asegúrate de manejar valores vacíos
        nSprint: tarea.nSprint || '',
        alcance: tarea.alcance || '',
        color: tarea.color || '',
        fechaInicio: tarea.fechaInicio || '',
        fechaFinal: tarea.fechaFinal || '',
    });
    handleShowEditModal(); // Abre el modal de edición
};
 
  const handleSave = () => {
    if (!validateForm()) return;

    if (currentTareas) {
      // Editar tarea existente
      setHu((prevHu) =>
        prevHu.map((tarea) =>
          tarea.id === currentTareas.id ? { ...tarea, ...formValues } : tarea
        )
      );
    } else {
      // Añadir nueva tarea
      const newTarea = {
        id: hu.length + 1,
        ...formValues,
      };
      setHu([...hu, newTarea]);
    }
    handleCloseModal(); // Cierra el modal de registro
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value, // Actualiza el valor basado en el nombre del campo
    }));
  };

  const handleAddTarea = () => {
    if (formValues.hu.trim() !== '') { // Asegúrate de que el campo no esté vacío
      const newTarea = {
        id: hu.length + 1, // Genera un ID único (puedes mejorarlo más adelante)
        tarea: formValues.hu,
      };
      setHu((prevHu) => [...prevHu, newTarea]); // Agrega la nueva tarea
      setFormValues({ ...formValues, hu: '' }); // Limpia el campo de entrada
      
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

  return (
    <div className="container custom-container pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Planificación</h1>
        <button className="btn btn-primary" onClick={() => handleShowModal()}>Registrar</button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div style={{height: '350px'}}>
          <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{margin:'5px'}}
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
                    <Form.Control
                      as={DatePicker}
                      defaultValue={dayjs('2022-04-17')}
                      onChange={(newValue) => {
                        // Maneja el cambio de valor aquí
                      }}
                      placeholder="Selecciona la Fecha"
                    />
                  </LocalizationProvider>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="formFechaFin">
                  <Form.Label>Fecha Fin</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Form.Control
                      as={DatePicker}
                      defaultValue={dayjs('2022-05-17')}
                      onChange={(newValue) => {
                        // Maneja el cambio de valor aquí
                      }}
                      placeholder="Selecciona la Fecha"
                    />
                  </LocalizationProvider>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="formNsprint">
                  <Form.Label>N° Sprint</Form.Label>
                  <Form.Control
                    type="text"
                    name="nSprint"
                    value={formValues.nSprint}
                    onChange={handleInputChange}
                    placeholder="Numero Sprint"
                  />
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
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group controlId="formHU">
                  <Form.Label>HU-Tarea</Form.Label>
                  <Form.Control
                    type="text"
                    name="hu"
                    value={formValues.hu}
                    onChange={handleInputChange}
                    placeholder="HUTarea"
                  />
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
                        currentItems.map((hu) => (
                          <tr key={hu.id}>
                            <td>{hu.tarea}</td>
                            <td>
                              <button className="icon-button" title="Editar" onClick={() => handleEdit(hu)}>
                                <FaEdit />
                              </button>
                              <button className="icon-button" title="Eliminar" onClick={() => handleDelete(hu.id)}>
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
            <span className="pagination-info">{`Página ${currentPage} de ${Math.ceil(hu.length / itemsPerPage)}`}</span>
            <Button
              className="pagination-button"
              disabled={currentPage === Math.ceil(hu.length / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button type="button" className="btn btn-primary">Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Planificacion;
