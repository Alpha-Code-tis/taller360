import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import Select from 'react-select';
import './Equipos.css';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]); // Para cargar estudiantes
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEquipo, setCurrentEquipo] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre_empresa: '',
    nombre_corto: '',
    correo_empresa: '',
    telefono: '',
    direccion: '',
    logo: null, // Para subir el archivo
    estudiantesSeleccionados: [], // Para almacenar los estudiantes seleccionados
  });
  const [formErrors, setFormErrors] = useState({});

  // Cargar equipos y estudiantes desde el backend
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipos');
        setEquipos(response.data);
        setFilteredEquipos(response.data);
      } catch (error) {
        toast.error('Error al cargar los equipos');
      }
    };

    const fetchEstudiantes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/sin-empresa');
        setEstudiantes(
          response.data.map((estudiante) => ({
            value: estudiante.id_estudiante,
            label: `${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`,
          }))
        );
      } catch (error) {
        toast.error('Error al cargar los estudiantes');
      }
    };

    fetchEquipos();
    fetchEstudiantes();
  }, []);

  // Manejar la búsqueda de equipos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredEquipos(equipos);
    } else {
      const filtered = equipos.filter((equipo) =>
        equipo.nombre_empresa.toLowerCase().includes(e.target.value.toLowerCase()) ||
        equipo.correo_empresa.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredEquipos(filtered);
    }
  };

  // Manejar la eliminación de equipos
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/equipos/${id}`);
      setEquipos(equipos.filter((equipo) => equipo.id !== id));
      setFilteredEquipos(filteredEquipos.filter((equipo) => equipo.id !== id));
      setShowDeleteModal(false);
      toast.success('Equipo eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el equipo');
    }
  };

  // Mostrar el modal para agregar/editar equipo
  const handleShowModal = (equipo = null) => {
    setSuccessMessage(null);
    if (equipo) {
      setFormValues({
        nombre_empresa: equipo.nombre_empresa || '',
        nombre_corto: equipo.nombre_corto || '',
        correo_empresa: equipo.correo_empresa || '',
        telefono: equipo.telefono || '',
        direccion: equipo.direccion || '',
        estudiantesSeleccionados: equipo.estudiantes || [],
      });
      setCurrentEquipo(equipo);
    } else {
      setFormValues({
        nombre_empresa: '',
        nombre_corto: '',
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

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
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
    const emailRegex = /\S+@\S+\.\S+/;
    const telefonoRegex = /^\d{8,10}$/; // Asumiendo que el teléfono debe tener entre 8 y 10 dígitos

    if (!formValues.nombre_empresa) {
      errors.nombre_empresa = 'El nombre del equipo es obligatorio.';
    }
    if (!formValues.nombre_corto) {
      errors.nombre_corto = 'El nombre corto es obligatorio.';
    }
    if (!emailRegex.test(formValues.correo_empresa)) {
      errors.correo_empresa = 'El correo electrónico no es válido.';
    }
    if (!telefonoRegex.test(formValues.telefono)) {
      errors.telefono = 'El número de teléfono debe contener entre 8 y 10 dígitos.';
    }
    if (!formValues.direccion) {
      errors.direccion = 'La dirección es obligatoria.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('nombre_empresa', formValues.nombre_empresa);
    formData.append('nombre_corto', formValues.nombre_corto);
    formData.append('correo_empresa', formValues.correo_empresa);
    formData.append('telefono', formValues.telefono);
    formData.append('direccion', formValues.direccion);
    if (formValues.logo) formData.append('logo', formValues.logo);
    formData.append('estudiantesSeleccionados', JSON.stringify(formValues.estudiantesSeleccionados.map((est) => est.value)));

    try {
        if (currentEquipo) {
            await axios.post(`http://localhost:8000/api/equipos/${currentEquipo.id}`, formData);
            setEquipos((prevEquipos) =>
                prevEquipos.map((equipo) =>
                    equipo.id === currentEquipo.id ? { ...equipo, ...formValues } : equipo
                )
            );
            toast.success('Equipo editado exitosamente');
        } else {
            const response = await axios.post('http://localhost:8000/api/equipos', formData);
            setEquipos([...equipos, response.data]);
            toast.success('Equipo agregado exitosamente');
        }
        handleCloseModal();
    } catch (error) {
        // Mostrar detalles del error
        console.error('Error al guardar el equipo:', error.response ? error.response.data : error.message);
        toast.error(`Error al guardar el equipo: ${error.response ? error.response.data.message : error.message}`);
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

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
              <tr key={equipo.id}>
                <td>{equipo.nombre_empresa}</td>
                <td>{equipo.correo_empresa}</td>
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
                <Form.Group controlId="formNombre_empresa" className="mb-3">
                  <Form.Label>Nombre del Equipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_empresa"
                    value={formValues.nombre_empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre del Equipo"
                    isInvalid={!!formErrors.nombre_empresa}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.nombre_equipo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="formNombre_corto" className="mb-3">
                  <Form.Label>Nombre Corto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_corto"
                    value={formValues.nombre_corto}
                    onChange={handleInputChange}
                    placeholder="Nombre Corto"
                    isInvalid={!!formErrors.nombre_corto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.nombre_corto}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="formCorreo_empresa" className="mb-3">
                  <Form.Label>Correo de la Empresa</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo_empresa"
                    value={formValues.correo_empresa}
                    onChange={handleInputChange}
                    placeholder="Correo de la Empresa"
                    isInvalid={!!formErrors.correo_empresa}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.correo_empresa}
                  </Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">
                    {formErrors.telefono}
                  </Form.Control.Feedback>
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
                  <Form.Control.Feedback type="invalid">
                    {formErrors.direccion}
                  </Form.Control.Feedback>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {currentEquipo ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Equipos;
