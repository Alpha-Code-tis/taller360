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

  const [equiposCargados, setEquiposCargados] = useState(false); // Nueva bandera

  const fetchEquipos = async () => {
    try {
      console.log('Cargando equipos...');
      const response = await axios.get(`${API_URL}equipos`);
      console.log(response);
  
      if (Array.isArray(response.data) && response.data.length > 0) {
        setEquipos(response.data);
        setFilteredEquipos(response.data);
  
        if (!equiposCargados) {
          toast.success('Información de equipos cargada correctamente', { id: 'equipos-toast' });
          setEquiposCargados(true);
        }
      } else if (Array.isArray(response.data) && response.data.length === 0) {
        if (!equiposCargados) {
          toast.error('No se encontraron equipos.', { id: 'equipos-toast' });
          setEquiposCargados(true);
        }
      } else {
        toast.error('Respuesta inesperada al cargar equipos.');
      }
  
      // Asegúrate de que el mensaje de carga desaparezca
      toast.dismiss('loading-info');
    } catch (error) {
      console.error('Error al cargar los equipos:', error);
      toast.error(`Error al cargar los equipos: ${error.message}`);
      // Asegúrate de que el mensaje de carga desaparezca incluso en caso de error
      toast.dismiss('loading-info');
    }
  };
    
  const fetchEstudiantes = async () => {
    try {
      console.log('Cargando estudiantes...');
      const response = await axios.get(`${API_URL}sin-empresa`);
      console.log(response); // Diagnóstico: verifica el contenido del response
  
      if (Array.isArray(response.data) && response.data.length > 0) {
        const formattedEstudiantes = response.data.map((estudiante) => ({
          value: estudiante.id_estudiante,
          label: `${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`,
        }));
        setEstudiantes(formattedEstudiantes);
        toast.success('Aún hay estudiantes que no tienen empresa.');
      } else if (Array.isArray(response.data) && response.data.length === 0) {
        toast.success('Todos los estudiantes ya tienen una empresa.');
      } else {
        toast.error('Respuesta inesperada al cargar estudiantes.');
        toast.error('No hay estudiantes disponibles para crear una empresa');
      }
    } catch (error) {
      console.error('Error al cargar estudiantes sin empresa:', error);
      toast.error('No existen estudiantes sin empresa disponibles');
      setEstudiantes([]);
    }
  };
    
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        toast.loading('Cargando información...', { id: 'loading-info' });
        await fetchEquipos();
        await fetchEstudiantes();
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
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
      const { empresa, estudiantes } = response.data;

      setCurrentEquipo({
        ...equipo,
        logo: empresa.logo, // Asegúrate de que el logo viene desde la API
        estudiantesSeleccionados: estudiantes,
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

    if (!formValues.nombre_corto.trim()) {
      errors.direccion = 'El nombre corto es requerido';
      isValid = false;
    }

    // if (!formValues.logo.trim()) {
    //   errors.direccion = 'La URL del logo es requerida';
    //   isValid = false;
    // }

    // Validar el campo gestion
    if (!formValues.gestion || !formValues.gestion.trim()) {
      errors.gestion = 'La gestión es requerida';
      isValid = false;
    } else if (!/^[1-2]-20(2[4-6])$/.test(formValues.gestion)) {
      errors.gestion = 'El formato de la gestión es inválido (ej: 1-2024 o 2-2024)';
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

    const Equipodata = {
      nombre_empresa: formValues.nombre_empresa,
      nombre_corto: formValues.nombre_corto,
      correo_empresa: formValues.correo_empresa,
      telefono: formValues.telefono,
      direccion: formValues.direccion,
      logo: formValues.logo, // Enviar la URL directamente
      estudiantesSeleccionados: formValues.estudiantesSeleccionados.map(est => est.value),
      gestion: formValues.gestion, // Agregar la gestión
    };

    try {
      if (currentEquipo) {
        await axios.put(`${API_URL}equipos/${currentEquipo.id_empresa}`, Equipodata);
        toast.success('Equipo actualizado correctamente');
      } else {
        await axios.post(`${API_URL}equipos`, Equipodata);
        toast.success('Equipo creado correctamente');

      }


      fetchEquipos(); // Refrescar la lista de equipos
      fetchEstudiantes();
      setShowModal(false); // Cerrar el modal
    } catch (error) {
      toast.error('Error al guardar el equipo');
    } finally {
      setIsSaving(false); // Finalizar el estado de guardado
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
              <th>Gestion</th>
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

      <Modal className="modal modal-custom" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
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
                    isInvalid={!!formErrors.gestion}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.gestion}</Form.Control.Feedback>
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
                    isInvalid={!!formErrors.nombre_corto}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.nombre_corto}</Form.Control.Feedback>
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
                    isInvalid={!!formErrors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.telefono}</Form.Control.Feedback>
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
                    isInvalid={!!formErrors.direccion}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.direccion}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="formLogo" className="mb-3">
                  <Form.Label>URL del Logo</Form.Label>
                  <Form.Control
                    type="url"
                    name="logo"
                    value={formValues.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    isInvalid={!!formErrors.logo}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.logo}</Form.Control.Feedback>
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
                    isInvalid={!!formErrors.estudiantesSeleccionados}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.estudiantesSeleccionados}</Form.Control.Feedback>
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
              {currentEquipo?.logo ? (
                <div className="circular-logo">
                  <img
                    src={
                      currentEquipo.logo.startsWith('http')
                        ? currentEquipo.logo // URL externa
                        : `http://localhost:8000/storage/${currentEquipo.logo}` // Logo almacenado localmente
                    }
                    alt="Logo de la Empresa"
                    className="img-fluid"
                  />
                </div>
              ) : (
                <p><strong>Logo:</strong> No disponible</p>
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
