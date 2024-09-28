import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios'; // Importamos axios
import './Docentes.css';

const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]); // Nuevo estado para almacenar los grupos
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDocente, setCurrentDocente] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    grupo: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetching docentes and grupos from the backend
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/docentes'); // GET request to fetch docentes
        setDocentes(response.data);
      } catch (err) {
        setError('Error al cargar los docentes');
        toast.error('Error al cargar los docentes');
      }
    };

    const fetchGrupos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/grupos'); // GET request to fetch grupos
        setGrupos(response.data); // Guardamos los grupos en el estado
      } catch (err) {
        toast.error('Error al cargar los grupos');
      }
    };

    fetchDocentes();
    fetchGrupos(); // Llamamos para obtener los grupos al cargar el componente
  }, []);

  // Handle Delete Docente
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este docente?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8000/api/docentes/${id}`); // DELETE request
                const updatedDocentes = docentes.filter((docente) => docente.id_docente !== id);
                setDocentes(updatedDocentes);
                toast.dismiss(t.id); // Cerrar el toast
                toast.success('Docente eliminado exitosamente');
              } catch (err) {
                toast.error('Error al eliminar el docente');
              }
            }}
            className="btn btn-danger me-2"
          >
            Sí, eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Cancelar la eliminación
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    ));
  };

  // Show Modal for adding or editing docentes
  const handleShowModal = (docente = null) => {
    if (docente) {
      setFormValues({
        nombre: docente.nombre_docente || '',
        apellidoPaterno: docente.ap_pat || '',
        apellidoMaterno: docente.ap_mat || '',
        correo: docente.correo,
        grupo: docente.id_grupo.toString(),
      });
      setCurrentDocente(docente);
    } else {
      setFormValues({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        grupo: '',
      });
      setCurrentDocente(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (/\d/.test(formValues.nombre)) {
      errors.nombre = 'El nombre no debe contener números.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.correo)) {
      errors.correo = 'Por favor, introduce un correo electrónico válido.';
    }
    if (!/^\d+$/.test(formValues.grupo)) {
      errors.grupo = 'El grupo debe contener solo números.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save (Create or Update Docente)
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor, revisa los errores en el formulario.');
      return;
    }

    const docenteData = {
      id_grupo: parseInt(formValues.grupo),
      nombre_docente: formValues.nombre,
      ap_pat: formValues.apellidoPaterno,
      ap_mat: formValues.apellidoMaterno,
      correo: formValues.correo,
      contrasenia: 'default_password', // Puedes actualizar esto según la lógica del sistema
    };

    try {
      if (currentDocente) {
        // PUT request to update the docente
        await axios.put(`http://localhost:8000/api/docentes/${currentDocente.id_docente}`, docenteData);
        setDocentes((prevDocentes) =>
          prevDocentes.map((docente) =>
            docente.id_docente === currentDocente.id_docente ? { ...docente, ...docenteData } : docente
          )
        );
        toast.success('Docente editado exitosamente');
      } else {
        // POST request to create a new docente
        const response = await axios.post('http://localhost:8000/api/docentes', docenteData);
        setDocentes([...docentes, response.data]);
        toast.success('Docente agregado exitosamente');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Error al guardar el docente');
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Docentes</h1>
        <button className="btn btn-primary" onClick={() => handleShowModal()}>
          + Agregar Docente
        </button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-container">
        <table className="table table-hover docentes-table">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Correo</th>
              <th>Grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((docente) => (
              <tr key={docente.id_docente}>
                <td>{`${docente.ap_pat} ${docente.ap_mat} ${docente.nombre_docente}`}</td>
                <td>{docente.correo}</td>
                <td>{docente.grupo?.nro_grupo || 'No asignado'}</td>                
                <td>
                  <button
                    className="icon-button"
                    title="Editar"
                    onClick={() => handleShowModal(docente)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-button"
                    title="Eliminar"
                    onClick={() => handleDelete(docente.id_docente)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentDocente ? 'Editar Docente' : 'Agregar Docente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formNombre" className="mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombres"
                    isInvalid={!!formErrors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formApellidoPaterno" className="mb-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidoPaterno"
                    value={formValues.apellidoPaterno}
                    onChange={handleInputChange}
                    placeholder="Apellido Paterno"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formApellidoMaterno" className="mb-3">
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidoMaterno"
                    value={formValues.apellidoMaterno}
                    onChange={handleInputChange}
                    placeholder="Apellido Materno"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCorreo" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formValues.correo}
                    onChange={handleInputChange}
                    placeholder="Correo Electrónico"
                    isInvalid={!!formErrors.correo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.correo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formGrupo" className="mb-3">
                  <Form.Label>Grupo</Form.Label>
                  <Form.Select
                    name="grupo"
                    value={formValues.grupo}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.grupo}
                  >
                    <option value="">Selecciona un grupo</option>
                    {/* Renderizamos los grupos obtenidos del backend */}
                    {grupos.map((grupo) => (
                      <option key={grupo.id_grupo} value={grupo.id_grupo}>
                        {grupo.nro_grupo}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.grupo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {currentDocente ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Docentes;
