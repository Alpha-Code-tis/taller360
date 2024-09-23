import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import './Estudiantes.css'; 

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correoInstitucional: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar estudiantes desde el backend
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/estudiantes');
        setEstudiantes(response.data);
        setFilteredEstudiantes(response.data);
      } catch (error) {
        setError('Error al cargar los estudiantes'); 
      }
    };

    fetchEstudiantes();
  }, []);

  // Manejar la búsqueda de estudiantes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredEstudiantes(estudiantes);
    } else {
      const filtered = estudiantes.filter((estudiante) =>
        estudiante.nombre.toLowerCase().includes(e.target.value.toLowerCase()) ||
        estudiante.correoInstitucional.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredEstudiantes(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/estudiantes/${id}`);
      setEstudiantes(estudiantes.filter((estudiante) => estudiante.id !== id));
      setFilteredEstudiantes(filteredEstudiantes.filter((estudiante) => estudiante.id !== id));
      setShowDeleteModal(false);
      setSuccessMessage('Estudiante eliminado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Error al eliminar el estudiante');
    }
  };

  const handleShowModal = (estudiante = null) => {
    setSuccessMessage(null);
    if (estudiante) {
      setFormValues({
        nombre: estudiante.nombre.split(' ')[2] || '',
        apellidoPaterno: estudiante.nombre.split(' ')[0],
        apellidoMaterno: estudiante.nombre.split(' ')[1] || '',
        correoInstitucional: estudiante.correoInstitucional,
      });
      setCurrentEstudiante(estudiante);
    } else {
      setFormValues({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correoInstitucional: '',
      });
      setCurrentEstudiante(null);
    }
    setShowModal(true);
  };

  const handleShowDeleteModal = (estudiante) => {
    setCurrentEstudiante(estudiante);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    const correoRegex = /^\d{9}@\S+\.\S+$/;

    if (/\d/.test(formValues.nombre)) {
      errors.nombre = 'El nombre no debe contener números.';
    }

    if (!correoRegex.test(formValues.correoInstitucional)) {
      errors.correoInstitucional = 'El correo institucional debe contener 9 números y un formato de correo válido.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (currentEstudiante) {
        await axios.put(`http://localhost:8000/api/estudiantes/${currentEstudiante.id}`, formValues);
        setEstudiantes(estudiantes.map((estudiante) =>
          estudiante.id === currentEstudiante.id ? formValues : estudiante
        ));
        setFilteredEstudiantes(estudiantes);
      } else {
        const response = await axios.post('http://localhost:8000/api/estudiantes', formValues);
        setEstudiantes([...estudiantes, response.data]);
        setFilteredEstudiantes([...filteredEstudiantes, response.data]);
      }

      setSuccessMessage(currentEstudiante ? 'Estudiante editado exitosamente.' : 'Estudiante agregado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
      handleCloseModal();
    } catch (error) {
      setError('Error al guardar el estudiante');
    }
  };

  const handleShowImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    console.log("Archivo arrastrado:", file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Archivo subido:", file);
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Estudiantes</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Agregar Estudiante</button>
          <button className="btn btn-secondary" onClick={handleShowImportModal}>+ Importar Lista</button>
        </div>
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

      {error && <p className="text-danger">{error}</p>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Correo Institucional</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudiantes.map((estudiante) => (
              <tr key={estudiante.id}>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.correoInstitucional}</td>
                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(estudiante)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleShowDeleteModal(estudiante)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar estudiante */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEstudiante ? 'Editar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
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
              <Col md={12}>
                <Form.Group controlId="formCorreoInstitucional" className="mb-3">
                  <Form.Label>Correo Institucional</Form.Label>
                  <Form.Control
                    type="text"
                    name="correoInstitucional"
                    value={formValues.correoInstitucional}
                    onChange={handleInputChange}
                    placeholder="Correo Institucional"
                    isInvalid={!!formErrors.correoInstitucional}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.correoInstitucional}
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
            {currentEstudiante ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Seguro que quieres eliminar al estudiante?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <center>
              {`${currentEstudiante?.apellidoPaterno || ''} ${currentEstudiante?.apellidoMaterno || ''} ${currentEstudiante?.nombre || ''}`}
            </center>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(currentEstudiante.id)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para importar archivo */}
      <Modal show={showImportModal} onHide={handleCloseImportModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Importar Lista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="drop-zone"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{
              border: '2px dashed #cccccc',
              padding: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            Arrastra el archivo aquí o{' '}
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{ color: '#007bff', cursor: 'pointer' }}>
              selecciona un archivo
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImportModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => console.log('Subir archivo')}>
            Subir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Estudiantes;
