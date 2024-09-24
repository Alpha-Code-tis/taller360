import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import './Equipos.css'; 

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEquipo, setCurrentEquipo] = useState(null);
  const [formValues, setFormValues] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar equipos desde el backend
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipos');
        setEquipos(response.data);
        setFilteredEquipos(response.data);
      } catch (error) {
        setError('Error al cargar los equipos');
      }
    };

    fetchEquipos();
  }, []);

  // Manejar la búsqueda de equipos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredEquipos(equipos);
    } else {
      const filtered = equipos.filter((equipo) =>
        equipo.nombreCompleto.toLowerCase().includes(e.target.value.toLowerCase()) ||
        equipo.correoElectronico.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredEquipos(filtered);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/equipos/${id}`);
      setEquipos(equipos.filter((equipo) => equipo.id !== id));
      setFilteredEquipos(filteredEquipos.filter((equipo) => equipo.id !== id));
      setShowDeleteModal(false);
      setSuccessMessage('Equipo eliminado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Error al eliminar el equipo');
    }
  };

  const handleShowModal = (equipo = null) => {
    setSuccessMessage(null);
    if (equipo) {
      setFormValues({
        nombreCompleto: equipo.nombreCompleto || '',
        correoElectronico: equipo.correoElectronico,
        telefono: equipo.telefono,
      });
      setCurrentEquipo(equipo);
    } else {
      setFormValues({
        nombreCompleto: '',
        correoElectronico: '',
        telefono: '',
      });
      setCurrentEquipo(null);
    }
    setShowModal(true);
  };

  const handleShowDeleteModal = (equipo) => {
    setCurrentEquipo(equipo);
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
    const emailRegex = /\S+@\S+\.\S+/;
    const telefonoRegex = /^\d{8,10}$/; // Asumiendo que el teléfono debe tener entre 8 y 10 dígitos

    if (!formValues.nombreCompleto) {
      errors.nombreCompleto = 'El nombre completo es obligatorio.';
    }

    if (!emailRegex.test(formValues.correoElectronico)) {
      errors.correoElectronico = 'El correo electrónico no es válido.';
    }

    if (!telefonoRegex.test(formValues.telefono)) {
      errors.telefono = 'El número de teléfono debe contener entre 8 y 10 dígitos.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (currentEquipo) {
        await axios.put(`http://localhost:8000/api/equipos/${currentEquipo.id}`, formValues);
        setEquipos(equipos.map((equipo) =>
          equipo.id === currentEquipo.id ? formValues : equipo
        ));
        setFilteredEquipos(equipos);
      } else {
        const response = await axios.post('http://localhost:8000/api/equipos', formValues);
        setEquipos([...equipos, response.data]);
        setFilteredEquipos([...filteredEquipos, response.data]);
      }

      setSuccessMessage(currentEquipo ? 'Equipo editado exitosamente.' : 'Equipo agregado exitosamente.');
      setTimeout(() => setSuccessMessage(null), 3000);
      handleCloseModal();
    } catch (error) {
      setError('Error al guardar el equipo');
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Equipos</h1>
        <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Nuevo Equipo</button>
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
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipos.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.nombreCompleto}</td>
                <td>{equipo.correoElectronico}</td>
                <td>{equipo.telefono}</td>
                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(equipo)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleShowDeleteModal(equipo)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar/editar equipo */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEquipo ? 'Editar Equipo' : 'Agregar Equipo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formNombreCompleto" className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombreCompleto"
                    value={formValues.nombreCompleto}
                    onChange={handleInputChange}
                    placeholder="Nombre Completo"
                    isInvalid={!!formErrors.nombreCompleto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.nombreCompleto}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formCorreoElectronico" className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correoElectronico"
                    value={formValues.correoElectronico}
                    onChange={handleInputChange}
                    placeholder="Correo Electrónico"
                    isInvalid={!!formErrors.correoElectronico}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.correoElectronico}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formTelefono" className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formValues.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                    isInvalid={!!formErrors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.telefono}
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
            {currentEquipo ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para confirmar eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Seguro que quieres eliminar el equipo?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <center>
              {`${currentEquipo?.nombreCompleto || ''} - ${currentEquipo?.correoElectronico || ''} - ${currentEquipo?.telefono || ''}`}
            </center>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => handleDelete(currentEquipo.id)}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Equipos;
