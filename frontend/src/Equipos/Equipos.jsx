import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa'; // Agregar FaEye para el ícono de vista
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
  const [showViewModal, setShowViewModal] = useState(false); // Modal para la vista
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
    toast((t) => (
      <div>
        <span>¿Estás seguro de que deseas eliminar este equipo?</span>
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8000/api/equipos/${id}`); // DELETE request
                const updatedEquipos = equipos.filter((equipo) => equipo.id !== id);
                setEquipos(updatedEquipos);
                setFilteredEquipos(updatedEquipos);
                toast.dismiss(t.id); // Cerrar el toast
                toast.success('Equipo eliminado exitosamente');
              } catch (err) {
                toast.error('Error al eliminar el equipo');
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
      // Reiniciar formValues para agregar un nuevo equipo
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

  // Mostrar el modal de vista de equipo
  const handleShowViewModal = (equipo) => {
    setCurrentEquipo(equipo);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormValues({ ...formValues, logo: e.target.files[0] });
  };

  const handleSave = async () => {
    // Validación y lógica para guardar el equipo
    const handleSave = async () => {
      // Validación de formulario antes de proceder
      if (!validateForm()) {
        toast.error('Por favor, revisa los errores en el formulario.');
        return;
      }
    
      // Crea un objeto FormData para manejar el envío de archivos
      const formData = new FormData();
      formData.append('nombre_empresa', formValues.nombre_empresa);
      formData.append('nombre_corto', formValues.nombre_corto);
      formData.append('correo_empresa', formValues.correo_empresa);
      formData.append('telefono', formValues.telefono);
      formData.append('direccion', formValues.direccion);
    
      // Agrega el logo si está presente
      if (formValues.logo) {
        formData.append('logo', formValues.logo);
      }
    
      // Agrega los estudiantes seleccionados en formato JSON
      formData.append('estudiantesSeleccionados', JSON.stringify(formValues.estudiantesSeleccionados.map(est => est.value)));
    
      try {
        if (currentEquipo) {
          // Actualización de un equipo existente (PUT o POST, dependiendo de tu backend)
          await axios.post(`http://localhost:8000/api/equipos/${currentEquipo.id}`, formData);
          // Actualiza el estado de equipos después de la edición
          setEquipos((prevEquipos) =>
            prevEquipos.map((equipo) =>
              equipo.id === currentEquipo.id ? { ...equipo, ...formValues } : equipo
            )
          );
          toast.success('Equipo editado exitosamente');
        } else {
          // Registro de un nuevo equipo (POST)
          const response = await axios.post('http://localhost:8000/api/equipos', formData);
          // Agrega el nuevo equipo al estado
          setEquipos([...equipos, response.data]);
          toast.success('Equipo registrado exitosamente');
        }
    
        // Cierra el modal y resetea el formulario
        handleCloseModal();
      } catch (error) {
        // Manejo de errores
        console.error('Error al guardar el equipo:', error.response ? error.response.data : error.message);
        toast.error(`Error al guardar el equipo: ${error.response ? error.response.data.message : error.message}`);
      }
    };
    
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
                  <button className="icon-button" title="Ver" onClick={() => handleShowViewModal(equipo)}>
                    <FaEye />
                  </button>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(equipo)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(equipo.id)}>
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
                <Form.Group controlId="formNombreEmpresa" className="mb-3">
                  <Form.Label>Nombre del Equipo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre_empresa"
                    value={formValues.nombre_empresa}
                    onChange={handleInputChange}
                    placeholder="Nombre del Equipo"
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
                  />
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {currentEquipo ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de vista para ver detalles del equipo */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentEquipo && (
            <div>
              <p><strong>Nombre del Equipo:</strong> {currentEquipo.nombre_empresa}</p>
              <p><strong>Nombre Corto:</strong> {currentEquipo.nombre_corto}</p>
              <p><strong>Correo de la Empresa:</strong> {currentEquipo.correo_empresa}</p>
              <p><strong>Teléfono:</strong> {currentEquipo.telefono}</p>
              <p><strong>Dirección:</strong> {currentEquipo.direccion}</p>
              <p><strong>Estudiantes:</strong> {currentEquipo.estudiantesSeleccionados?.map(est => est.label).join(', ')}</p>
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
