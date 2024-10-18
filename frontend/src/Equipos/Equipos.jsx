import { API_URL } from '../config';              
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa'; // FaEye para el botón de detalles
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Select from 'react-select';
import './Equipos.css';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // Estado para el modal de detalles
  const [currentEquipo, setCurrentEquipo] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar el guardado

  const [formValues, setFormValues] = useState({
    nombre_empresa: '',
    gestion: '',
    nombre_corto: '',
    correo_empresa: '',
    telefono: '',
    direccion: '',
    logo: null,
    estudiantesSeleccionados: [],
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch equipos and estudiantes from backend
  const fetchEquipos = async () => {
    try {
      const response = await axios.get(`${API_URL}equipos`);
      setEquipos(response.data);
      setFilteredEquipos(response.data);
    } catch (error) {
      toast.error('Error al cargar los equipos');
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(`${API_URL}sin-empresa`);
      const formattedEstudiantes = response.data.map((estudiante) => ({
        value: estudiante.id_estudiante,
        label: `${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`,
      }));
      setEstudiantes(formattedEstudiantes);
    } catch (error) {
      toast.error('Error al cargar los estudiantes');
    }
  };

  useEffect(() => {
    fetchEquipos();
    fetchEstudiantes();
  }, []);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (searchValue === '') {
      setFilteredEquipos(equipos);
    } else {
      const filtered = equipos.filter((equipo) =>
        equipo.nombre_empresa.toLowerCase().includes(searchValue)
      );
      setFilteredEquipos(filtered);
    }
  };

  // Mostrar el modal para agregar o editar equipo
  const handleShowModal = (equipo = null) => {
    if (equipo) {
      setFormValues({
        nombre_empresa: equipo.nombre_empresa || '',
        nombre_corto: equipo.nombre_corto || '',
        gestion: equipo.gestion || '',
        correo_empresa: equipo.correo_empresa || '',
        telefono: equipo.telefono || '',
        direccion: equipo.direccion || '',
        logo: equipo.logo || null,
        estudiantesSeleccionados: equipo.estudiantes || [],
      });
      setCurrentEquipo(equipo);
    } else {
      setFormValues({
        nombre_empresa: '',
        nombre_corto: '',
        gestion: '',
        correo_empresa: '',
        telefono: '',
        direccion: '',
        logo: null,
        estudiantesSeleccionados: [],
      });
      setCurrentEquipo(null);
    }
    setShowModal(true);
  };

  // Mostrar el modal para ver los detalles del equipo
  const handleShowViewModal = async (equipo) => {
    try {
      const response = await axios.get(`${API_URL}empresa/${equipo.id_empresa}/estudiantes`);
      const estudiantesDelEquipo = response.data;

      setCurrentEquipo({
        ...equipo,
        estudiantesSeleccionados: estudiantesDelEquipo,
      });
      setShowViewModal(true); // Mostrar modal de detalles
    } catch (error) {
      toast.error('Error al cargar los estudiantes del equipo.');
    }
  };

  // Handle Delete Equipo con confirmación
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este equipo?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`${API_URL}equipos/${id}`);
                toast.dismiss(t.id);
                toast.success('Equipo eliminado exitosamente');
                fetchEquipos(); // Refrescar la lista de equipos después de eliminar
              } catch (err) {
                toast.error('Error al eliminar el equipo');
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

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
    setIsSaving(false); // Reiniciar el estado de guardado
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false); // Cerrar el modal de detalles
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormValues({ ...formValues, logo: e.target.files[0] });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formValues.nombre_empresa.trim()) {
      errors.nombre_empresa = 'El nombre del equipo es requerido';
      isValid = false;
    }

    if (!formValues.correo_empresa.trim()) {
      errors.correo_empresa = 'El correo de la empresa es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.correo_empresa)) {
      errors.correo_empresa = 'El formato del correo es inválido';
      isValid = false;
    }

    if (!formValues.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
      isValid = false;
    }

    if (!formValues.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true); // Indicar que se está guardando

    const Equipodata = new FormData();
    Equipodata.append('nombre_empresa', formValues.nombre_empresa);
    Equipodata.append('nombre_corto', formValues.nombre_corto);
    Equipodata.append('correo_empresa', formValues.correo_empresa);
    Equipodata.append('telefono', formValues.telefono);
    Equipodata.append('direccion', formValues.direccion);
    Equipodata.append('logo', formValues.logo);
    formValues.estudiantesSeleccionados.forEach(est => {
      Equipodata.append('estudiantesSeleccionados[]', est.value);
    });

    const promise = currentEquipo
      ? axios.put(`${API_URL}equipos/${currentEquipo.id_empresa}`, Equipodata, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      : axios.post(`${API_URL}equipos`, Equipodata, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    toast.promise(
      promise,
      {
        loading: 'Guardando...',
        success: <b>{currentEquipo ? 'Equipo editado exitosamente' : 'Equipo registrado exitosamente'}</b>,
        error: <b>Error al guardar el equipo</b>,
      }
    );

    try {
      await promise;
      fetchEquipos();
      handleCloseModal();
    } catch (error) {
      setIsSaving(false); // Si ocurre un error, permitir que se intente nuevamente
    }
  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Equipos</h1>
        <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Nuevo Equipo</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>Nombre del Equipo</th>
              <th>Correo de la Empresa</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipos.map((equipo) => (
              <tr key={equipo.id_empresa}>
                <td>{equipo.nombre_empresa}</td>
                <td>{equipo.correo_empresa}</td>
                <td>{equipo.gestion}</td>
                <td>
                  <button className="icon-button" title="Ver" onClick={() => handleShowViewModal(equipo)}>
                    <FaEye />
                  </button>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(equipo)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(equipo.id_empresa)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentEquipo ? 'Editar Equipo' : 'Agregar Equipo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
            <Col md={6}>
                <Form.Group controlId="formNombreEmpresa" className="mb-3">
                  <Form.Label>Nombre del Equipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_empresa"
                    value={formValues.nombre_empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre del Equipo"
                    isInvalid={!!formErrors.nombre_empresa}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.nombre_empresa}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formNombreEmpresa" className="mb-3">
                  <Form.Label>Gestion</Form.Label>
                  <Form.Control
                    type="text"
                    name="gestion"
                    value={formValues.gestion}
                    onChange={handleInputChange}
                    placeholder="#-#####"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formNombreCorto" className="mb-3">
                  <Form.Label>Nombre Corto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_corto"
                    value={formValues.nombre_corto}
                    onChange={handleInputChange}
                    placeholder="Nombre Corto"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formCorreoEmpresa" className="mb-3">
                  <Form.Label>Correo de la Empresa</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo_empresa"
                    value={formValues.correo_empresa}
                    onChange={handleInputChange}
                    placeholder="Correo de la Empresa"
                    isInvalid={!!formErrors.correo_empresa}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.correo_empresa}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formTelefono" className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formValues.telefono}
                    onChange={handleInputChange}
                    placeholder="Teléfono"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formDireccion" className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formValues.direccion}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="formLogo" className="mb-3">
                  <Form.Label>Logo</Form.Label>
                  <Form.Control
                    type="file"
                    name="logo"
                    accept=".png"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="formEstudiantes" className="mb-3">
                  <Form.Label>Añadir Estudiantes</Form.Label>
                  <Select
                    isMulti
                    name="estudiantesSeleccionados"
                    value={formValues.estudiantesSeleccionados}
                    options={estudiantes}
                    onChange={(selectedOptions) =>
                      setFormValues({ ...formValues, estudiantesSeleccionados: selectedOptions })
                    }
                    placeholder="Selecciona estudiantes"
                  />
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
            {isSaving ? 'Guardando...' : currentEquipo ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver los detalles del equipo */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEquipo && (
            <div>
              {currentEquipo.logo && (
                <div className="circular-logo">
                  <img
                    src={`http://localhost:8000/storage/${currentEquipo.logo}`}
                    alt="Logo de la Empresa"
                  />
                </div>
              )}
              <p><strong>Nombre del Equipo:</strong> {currentEquipo.nombre_empresa}</p>
              <p><strong>Nombre Corto:</strong> {currentEquipo.nombre_corto}</p>
              <p><strong>Correo de la Empresa:</strong> {currentEquipo.correo_empresa}</p>
              <p><strong>Teléfono:</strong> {currentEquipo.telefono}</p>
              <p><strong>Dirección:</strong> {currentEquipo.direccion}</p>
              <p><strong>Estudiantes Añadidos:</strong></p>
              <ul>
                {currentEquipo.estudiantesSeleccionados && currentEquipo.estudiantesSeleccionados.length > 0 ? (
                  currentEquipo.estudiantesSeleccionados.map((est) => (
                    <li key={est.id_estudiante}>
                      {`${est.ap_pat} ${est.ap_mat} ${est.nombre_estudiante}`}
                    </li>
                  ))
                ) : (
                  <p>No hay estudiantes asignados a este equipo.</p>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Equipos;
