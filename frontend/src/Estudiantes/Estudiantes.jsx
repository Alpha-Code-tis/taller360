import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Estudiantes.css';

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentEstudiante, setCurrentEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    codigoSis: '',
    esRepresentante: false,
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Estado para indicar si se está guardando

  // Fetching estudiantes from the backend
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/estudiantes');
      setEstudiantes(response.data);
      setFilteredEstudiantes(response.data);

      if (response.data.length === 0) {
        toast.error('No hay estudiantes registrados.');
      }
    } catch (err) {
      toast.error('Error al cargar los estudiantes.');
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  // Update filteredEstudiantes based on searchTerm
  useEffect(() => {
    const filtered = estudiantes.filter((estudiante) => {
      const fullName = `${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`.toLowerCase();
      const codigoSis = estudiante.codigo_sis.toString();
      const searchValue = searchTerm.toLowerCase();
      return fullName.includes(searchValue) || codigoSis.includes(searchValue);
    });
    setFilteredEstudiantes(filtered);
  }, [searchTerm, estudiantes]);

  // Handle Delete Estudiante
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este estudiante?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8000/api/estudiantes/${id}`);
                toast.dismiss(t.id);
                toast.success('Estudiante eliminado exitosamente');
                fetchEstudiantes();
              } catch (err) {
                toast.error('Error al eliminar el estudiante');
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

  // Show Modal for adding or editing estudiantes
  const handleShowModal = (estudiante = null) => {
    if (estudiante) {
      setFormValues({
        nombre: estudiante.nombre_estudiante || '',
        apellidoPaterno: estudiante.ap_pat || '',
        apellidoMaterno: estudiante.ap_mat || '',
        codigoSis: estudiante.codigo_sis,
        esRepresentante: estudiante.id_representante ? true : false,
      });
      setCurrentEstudiante(estudiante);
    } else {
      setFormValues({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        codigoSis: '',
        esRepresentante: false,
      });
      setCurrentEstudiante(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
    setIsSaving(false); // Reiniciamos el estado de guardado
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const errors = {};
    if (/\d/.test(formValues.nombre)) {
      errors.nombre = 'El nombre no debe contener números.';
    }
    if (!/^\d{9}$/.test(formValues.codigoSis)) {
      errors.codigoSis = 'El Código SIS debe contener 9 dígitos.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save (Create or Update Estudiante)
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor, revisa los errores en el formulario.');
      return;
    }

    setIsSaving(true); // Deshabilitamos el botón de guardar

    const estudianteData = {
      nombre_estudiante: formValues.nombre,
      ap_pat: formValues.apellidoPaterno,
      ap_mat: formValues.apellidoMaterno,
      codigo_sis: formValues.codigoSis,
      es_representante: formValues.esRepresentante,
    };

    const promise = currentEstudiante
      ? axios.put(`http://localhost:8000/api/estudiantes/${currentEstudiante.id_estudiante}`, estudianteData)
      : axios.post('http://localhost:8000/api/estudiantes', estudianteData);

    toast.promise(
      promise,
      {
        loading: 'Guardando...',
        success: <b>{currentEstudiante ? 'Estudiante editado exitosamente' : 'Estudiante agregado exitosamente'}</b>,
        error: <b>Error al guardar el estudiante</b>,
      }
    );

    try {
      await promise;
      await fetchEstudiantes(); // Refrescamos la lista de estudiantes
      handleCloseModal();
    } catch (err) {
      // El manejo de errores ya se realiza en toast.promise
    } finally {
      setIsSaving(false); // Rehabilitamos el botón de guardar
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Estudiantes</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Nuevo Estudiante</button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, apellido o código SIS"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}
      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Código SIS</th>
              <th>¿Es Representante?</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudiantes.map((estudiante) => (
              <tr key={estudiante.id_estudiante}>
                <td>{`${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`}</td>
                <td>{estudiante.codigo_sis}</td>
                <td>{estudiante.id_representante ? 'Sí' : 'No'}</td>
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

      {/* Modal para agregar/editar estudiante */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEstudiante ? 'Editar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="formNombre" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formApellidoPaterno" className="mb-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidoPaterno"
                    value={formValues.apellidoPaterno}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="formApellidoMaterno" className="mb-3">
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellidoMaterno"
                    value={formValues.apellidoMaterno}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formCodigoSis" className="mb-3">
                  <Form.Label>Código SIS</Form.Label>
                  <Form.Control
                    type="text"
                    name="codigoSis"
                    value={formValues.codigoSis}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.codigoSis}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.codigoSis}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="formEsRepresentante" className="mb-3">
              <Form.Check
                type="checkbox"
                label="¿Es representante?"
                name="esRepresentante"
                checked={formValues.esRepresentante}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : currentEstudiante ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Estudiantes;
