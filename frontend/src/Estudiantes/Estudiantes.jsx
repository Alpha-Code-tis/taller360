import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios'; // Importamos axios
import './Estudiantes.css';

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // Modal para importar lista
  const [currentEstudiante, setCurrentEstudiante] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    codigoSis: '',
    esRepresentante: false, // Nuevo campo
  });
  const [formErrors, setFormErrors] = useState({});
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);

  // Fetching estudiantes from the backend
  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/estudiantes'); // GET request to fetch estudiantes
        setEstudiantes(response.data);
      } catch (err) {
        toast.error('Error al cargar los estudiantes');
      }
    };

    fetchEstudiantes();
  }, []);

  // Handle Delete Estudiante
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este estudiante?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8000/api/estudiantes/${id}`); // DELETE request
                const updatedEstudiantes = estudiantes.filter((estudiante) => estudiante.id_estudiante !== id);
                setEstudiantes(updatedEstudiantes);
                toast.dismiss(t.id); // Cerrar el toast
                toast.success('Estudiante eliminado exitosamente');
              } catch (err) {
                toast.error('Error al eliminar el estudiante');
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

  // Show Modal for adding or editing estudiantes
  const handleShowModal = (estudiante = null) => {
    if (estudiante) {
      setFormValues({
        nombre: estudiante.nombre_estudiante || '',
        apellidoPaterno: estudiante.ap_pat || '',
        apellidoMaterno: estudiante.ap_mat || '',
        codigoSis: estudiante.codigo_sis,
        esRepresentante: estudiante.id_representante ? true : false, // Asignar verdadero si hay un representante
      });
      setCurrentEstudiante(estudiante);
    } else {
      setFormValues({
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        codigoSis: '',
        esRepresentante: false, // Resetear el campo
      });
      setCurrentEstudiante(null);
    }
    setShowModal(true);
  };  

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
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

    const estudianteData = {
      nombre_estudiante: formValues.nombre,
      ap_pat: formValues.apellidoPaterno,
      ap_mat: formValues.apellidoMaterno,
      codigo_sis: formValues.codigoSis,
      es_representante: formValues.esRepresentante, // Agregar este campo
    };

    try {
      if (currentEstudiante) {
        // PUT request to update the estudiante
        await axios.put(`http://localhost:8000/api/estudiantes/${currentEstudiante.id_estudiante}`, estudianteData);
        setEstudiantes((prevEstudiantes) =>
          prevEstudiantes.map((estudiante) =>
            estudiante.id_estudiante === currentEstudiante.id_estudiante
              ? { ...estudiante, ...estudianteData }
              : estudiante
          )
        );
        toast.success('Estudiante editado exitosamente');
      } else {
        // POST request to create a new estudiante
        const response = await axios.post('http://localhost:8000/api/estudiantes', estudianteData);
        setEstudiantes([...estudiantes, response.data]);
        toast.success('Estudiante agregado exitosamente');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Error al guardar el estudiante');
    }
  };

  // Mostrar Modal de Importar Lista
  const handleShowImportModal = () => {
    setShowImportModal(true);
  };

  // Cerrar Modal de Importar Lista
  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  // Manejar la subida de archivo arrastrado
  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    console.log("Archivo arrastrado:", file);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
  
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8000/api/estudiantes/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Respuesta de la API:', response.data); // Verifica la respuesta
      if (Array.isArray(response.data)) {
        setEstudiantes((prev) => [...prev, ...response.data]);
        setFilteredEstudiantes((prev) => [...prev, ...response.data]);
        toast.success('Estudiantes importados exitosamente.');
      } else {
        throw new Error('La respuesta no es un array.');
      }
  
      handleCloseImportModal();
    } catch (error) {
      setError('Error al importar estudiantes: ' + error.message);
      console.error(error);
    }
  };
  
  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Estudiantes</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Nuevo Estudiante</button>
          <button className="btn btn-secondary" onClick={handleShowImportModal}>+ Importar Lista</button>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Código SIS</th>
              <th>¿Es Representante?</th> {/* Nueva columna */}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.id_estudiante}>
                <td>{`${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`}</td>
                <td>{estudiante.codigo_sis}</td>
                <td>{estudiante.id_representante ? 'Sí' : 'No'}</td> {/* Mostrar si es representante */}
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para importar lista */}
      <Modal show={showImportModal} onHide={handleCloseImportModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Importar Lista de Estudiantes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Selecciona un archivo para importar</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleFileUpload} />
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImportModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            Subir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Estudiantes;
