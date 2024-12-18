import { API_URL } from '../config';              
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
      const response = await axios.get(`${API_URL}estudiantes`);
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
    console.log(estudiantes);
    const filtered = estudiantes.filter((estudiante) => {
      const fullName = `${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`.toLowerCase();
      const codigoSis = estudiante.codigo_sis ? estudiante.codigo_sis.toString().toLowerCase() : '';
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
                await axios.delete(`${API_URL}estudiantes/${id}`);
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
    if (!formValues.nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/.test(formValues.nombre)) {
      errors.nombre = 'El nombre debe contener entre 3 y 30 caracteres y solo puede contener letras.';
    }

    if (!formValues.apellidoPaterno) {
      errors.apellidoPaterno = 'El apellido paterno es obligatorio.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(formValues.apellidoPaterno)) {
      errors.apellidoPaterno = 'El apellido paterno debe contener entre 2 y 30 caracteres y solo puede contener letras.';
    }

    if (formValues.apellidoMaterno && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(formValues.apellidoMaterno)) {
      errors.apellidoMaterno = 'El apellido materno debe contener entre 2 y 30 caracteres y solo puede contener letras.';
    }    

    if(!formValues.codigoSis){
      errors.codigoSis = 'El código sis es obligatorio';
    }else if(!/^\d{9}$/.test(formValues.codigoSis)) {
      errors.codigoSis = 'El Código SIS debe contener 9 dígitos ';
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
      ? axios.put(`${API_URL}estudiantes/${currentEstudiante.id_estudiante}`, estudianteData)
      : axios.post(`${API_URL}estudiantes`, estudianteData);

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
    } catch (error) {
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
    } finally {
      // Reactivamos el botón de guardar, independientemente del resultado
      setIsSaving(false);
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo antes de subir.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsSaving(true);

      const response = await axios.post(`${API_URL}estudiantes/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('Estudiantes importados exitosamente.');
        fetchEstudiantes(); // Recargar datos
        handleCloseImportModal(); // Cerrar el modal
      } else {
        toast.error('Hubo un problema al importar los estudiantes.');
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error.';
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          errorMessage = responseData.error;
        }
        if (responseData.errors) {
          const backendErrors = responseData.errors;
          errorMessage += ' Errores: ' + Object.values(backendErrors).join(', '); // Mostrar errores específicos
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
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
      <Modal className="modal modal-custom" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
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
                    isInvalid={!!formErrors.apellidoPaterno}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.apellidoPaterno}</Form.Control.Feedback>
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
                    isInvalid={!!formErrors.apellidoMaterno}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.apellidoMaterno}</Form.Control.Feedback>
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
      
      {/* Modal para importar archivo */}
      <Modal show={showImportModal} onHide={handleCloseImportModal}>
        <Modal.Header closeButton>
          <Modal.Title>Importar Lista de Estudiantes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile">
            <Form.Label>Seleccionar archivo:</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            {file && <p>Archivo seleccionado: {file.name}</p>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseImportModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleFileUpload} disabled={!file}>
            Subir Archivo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Estudiantes;
