// src/Representante_legal/Docentes.jsx
import React, { useEffect, useState } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './Docentes.css';

const Docentes = () => {
  const initialDocentes = [
    { id: 1, nombre: 'Flores Villarroel Corina', correo: 'florescorina@gmail.com', grupo: 1 },
    { id: 2, nombre: 'Blanco Coca Leticia', correo: 'blancoleticia23@gmail.com', grupo: 2 },
    { id: 3, nombre: 'Escalera Fernandez David', correo: 'escaleradavid@gmail.com', grupo: 3 },
    { id: 4, nombre: 'Rodriguez Bilbao Erika Patricia', correo: 'rodriguezpatricia@gmail.com', grupo: 4 },
  ];

  const [docentes, setDocentes] = useState([]);
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

  useEffect(() => {
    const fetchDocentes = () => {
      try {
        setDocentes(initialDocentes);
      } catch (err) {
        setError('Error al cargar los docentes');
      }
    };

    fetchDocentes();
  }, []);

  const handleDelete = (id) => {
    try {
      const updatedDocentes = docentes.filter((docente) => docente.id !== id);
      setDocentes(updatedDocentes);
    } catch (err) {
      setError('Error al eliminar el docente');
    }
  };

  const handleShowModal = (docente = null) => {
    if (docente) {
      // Si se edita, se cargan los valores del docente seleccionado
      setFormValues({
        nombre: docente.nombre.split(' ')[2] || '',
        apellidoPaterno: docente.nombre.split(' ')[0],
        apellidoMaterno: docente.nombre.split(' ')[1] || '',
        correo: docente.correo,
        grupo: docente.grupo.toString(),
      });
      setCurrentDocente(docente);
    } else {
      // Si es nuevo, los campos están vacíos
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

  const handleSave = () => {
    if (!validateForm()) return;

    if (currentDocente) {
      // Editar docente existente
      setDocentes((prevDocentes) =>
        prevDocentes.map((docente) =>
          docente.id === currentDocente.id ? { ...docente, ...formValues } : docente
        )
      );
    } else {
      // Añadir nuevo docente
      const newDocente = {
        id: docentes.length + 1,
        nombre: `${formValues.apellidoPaterno} ${formValues.apellidoMaterno} ${formValues.nombre}`,
        correo: formValues.correo,
        grupo: parseInt(formValues.grupo),
      };
      setDocentes([...docentes, newDocente]);
    }
    handleCloseModal();
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Docentes</h1>
        <button className="btn btn-primary" onClick={() => handleShowModal()}>+ Agregar Docente</button>
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
              <tr key={docente.id}>
                <td>{docente.nombre}</td>
                <td>{docente.correo}</td>
                <td>{docente.grupo}</td>
                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(docente)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(docente.id)}>
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
                <Form.Group controlId="formNombre"className="mb-3"> 
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
                <Form.Group controlId="formApellidoPaterno"className="mb-3">
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
                <Form.Group controlId="formApellidoMaterno"className="mb-3">
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
                <Form.Group controlId="formCorreo"className="mb-3">
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
                <Form.Group controlId="formGrupo">
                  <Form.Label>Grupo</Form.Label>
                  <Form.Control
                    type="text"
                    name="grupo"
                    value={formValues.grupo}
                    onChange={handleInputChange}
                    placeholder="Grupo"
                    isInvalid={!!formErrors.grupo}
                  />
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
