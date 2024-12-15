import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Docentes.css';


const Docentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [currentDocente, setCurrentDocente] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [formValues, setFormValues] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    grupo: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoadingDocentes, setIsLoadingDocentes] = useState(false); // Nuevo estado para indicar carga de docentes
  const [isSaving, setIsSaving] = useState(false); // Nuevo estado para indicar si se está guardando

  // Fetching docentes and grupos from the backend
  const fetchDocentes = async () => {
    setIsLoadingDocentes(true);
    try {
      const response = await axios.get(`${API_URL}docentes`);
      setDocentes(response.data);
    } catch (err) {
      setError('Error al cargar los docentes');
      toast.error('Error al cargar los docentes');
    } finally {
      setIsLoadingDocentes(false);
    }
  };

  const fetchGrupos = async () => {
    try {
      const response = await axios.get(`${API_URL}grupos`);
      setGrupos(response.data);
    } catch (err) {
      toast.error('Error al cargar los grupos');
    }
  };

  useEffect(() => {
    fetchDocentes();
    fetchGrupos();
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
                await axios.delete(`${API_URL}docentes/${id}`);
                await fetchDocentes(); // Refrescamos la lista después de eliminar
                toast.dismiss(t.id);
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
            onClick={() => toast.dismiss(t.id)}
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
        correo: docente.correo || '',
        grupo: docente.id_grupo ? docente.id_grupo.toString() : '',
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
    setIsSaving(false); // Reiniciamos el estado de guardado
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (name === 'grupo' && value === 'nuevo') {
      setShowNewGroupModal(true);
    }
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

    if (!formValues.correo) {
      errors.correo = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.correo)) {
      errors.correo = 'Por favor, introduce un correo electrónico válido.';
    }

    if (!formValues.grupo) {
      errors.grupo = 'El grupo es obligatorio.';
    } else if (!/^\d+$/.test(formValues.grupo)) {
      errors.grupo = 'El grupo debe contener solo números.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Por favor, revisa los errores en el formulario.');
      return;
    }

    setIsSaving(true); 

    const docenteData = {
      id_grupo: parseInt(formValues.grupo),
      nombre_docente: formValues.nombre,
      ap_pat: formValues.apellidoPaterno,
      ap_mat: formValues.apellidoMaterno,
      correo: formValues.correo,
      contrasenia: 'default_password', // Actualiza esto según la lógica del sistema
    };

    const promise = currentDocente
      ? axios.put(`${API_URL}docentes/${currentDocente.id_docente}`, docenteData)
      : axios.post(`${API_URL}docentes`, docenteData);

    toast.promise(
      promise,
      {
        loading: 'Guardando...',
        success: <b>{currentDocente ? 'Docente editado exitosamente' : 'Docente agregado exitosamente'}</b>,
        error: <b>Error al guardar el docente</b>,
      }
    );

    try {
      await promise;
      await fetchDocentes(); // Refrescamos la lista de docentes
      handleCloseModal();
    } catch (err) {
      // El manejo de errores ya se realiza en toast.promise
    } finally {
      setIsSaving(false); // Rehabilitamos el botón de guardar
    }
  };

  const handleSaveNewGroup = async () => {
    const groupNumber = parseInt(newGroupName, 10);
    if (groupNumber <= 0 || groupNumber > 20) {
      toast.error('El número del grupo debe estar entre 1 y 20.');
      return;
    }
  
    if (newGroupName.trim() === '') {
      toast.error('El nombre del grupo no puede estar vacío.');
      return;
    }
  
    try {
      const response = await axios.post(`${API_URL}grupos`, { nro_grupo: newGroupName });
      setGrupos([...grupos, response.data]);
      setNewGroupName('');
      setShowNewGroupModal(false);
      toast.success('Grupo agregado exitosamente');
    } catch (err) {
      toast.error('Error al agregar el grupo');
    }
  };
  
  


return (
  <div className="container mt-2 pt-3" >
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
          {isLoadingDocentes ? (
            <tr>
              <td colSpan="4" className="text-center">
                Cargando datos...
              </td>
            </tr>
          ) : docentes.length > 0 ? (
            docentes.map((docente) => (
              <tr key={docente.id_docente}>
                <td>{`${docente.ap_pat || ''} ${docente.ap_mat || ''} ${docente.nombre_docente || ''}`}</td>
                <td>{docente.correo || ''}</td>
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
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay docentes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

      {/* Modal */}
      <Modal className = "modal modal-custom" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
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
                    isInvalid={!!formErrors.apellidoPaterno}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.apellidoPaterno}
                  </Form.Control.Feedback>
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
                    isInvalid={!!formErrors.apellidoMaterno}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.apellidoMaterno}
                  </Form.Control.Feedback>
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
                <Form.Control
                  as="select"
                  name="grupo"
                  value={formValues.grupo}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors.grupo}
                >
                  <option value="">Selecciona un grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id_grupo} value={grupo.id_grupo}>
                      {grupo.nro_grupo}
                    </option>
                  ))}
                  <option value="nuevo">+ Añadir nuevo grupo</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formErrors.grupo}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Registrar' : currentDocente ? 'Guardar Cambios' : 'Registrar'}
        </Button>
      </Modal.Footer>
    </Modal>
      {/* Modal para añadir nuevo grupo */}
      <Modal show={showNewGroupModal} onHide={() => setShowNewGroupModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewGroup" className="mb-3">
              <Form.Label>Ingrese un número</Form.Label>
              <Form.Control
                type="number"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ingrese el número del nuevo grupo"
                min="0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewGroupModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveNewGroup}>
            Guardar Grupo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

};

export default Docentes;
