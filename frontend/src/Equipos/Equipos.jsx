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
      const estudiantesData = response.data;
  
      // Filtrar los estudiantes que ya están asignados a algún equipo
      const estudiantesAsignados = equipos.flatMap(equipo => equipo.estudiantesSeleccionados || []);
  
      const estudiantesDisponibles = estudiantesData.filter(estudiante => {
        return !estudiantesAsignados.some(asignado => asignado && asignado.value === estudiante.id_estudiante);
      });
  
      const formattedEstudiantes = estudiantesDisponibles.map((estudiante) => ({
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

  // Manejar la búsqueda de equipos
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  
    if (e.target.value === '') {
      setFilteredEquipos(equipos); // Si el campo de búsqueda está vacío, mostrar todos los equipos
    } else {
      const searchValue = e.target.value.toLowerCase();
  
      const filtered = equipos.filter((equipo) => {
        const nombreEmpresa = equipo.nombre_empresa ? equipo.nombre_empresa.toLowerCase() : ''; // Verificar si existe
        const correoEmpresa = equipo.correo_empresa ? equipo.correo_empresa.toLowerCase() : '';  // Verificar si existe
  
        // Filtrar equipos basados en nombre o correo de la empresa
        return nombreEmpresa.includes(searchValue) || correoEmpresa.includes(searchValue);
      });
  
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
  const handleShowViewModal = async (equipo) => {
    // Llamar a un endpoint que devuelva los estudiantes del equipo
    try {
      const response = await axios.get(`http://localhost:8000/api/empresa/${equipo.id_empresa}/estudiantes`);
      const estudiantesDelEquipo = response.data;

      // Actualizar el equipo actual con los estudiantes cargados
      setCurrentEquipo({
        ...equipo,
        estudiantesSeleccionados: estudiantesDelEquipo
      });

      setShowViewModal(true);
    } catch (error) {
      toast.error('Error al cargar los estudiantes del equipo.');
    }
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

  // Función para validar el formulario
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validación del campo "nombre_empresa"
    if (!formValues.nombre_empresa.trim()) {
      errors.nombre_empresa = 'El nombre del equipo es requerido';
      isValid = false;
    }

    // Validación del campo "correo_empresa"
    if (!formValues.correo_empresa.trim()) {
      errors.correo_empresa = 'El correo de la empresa es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.correo_empresa)) {
      errors.correo_empresa = 'El formato del correo es inválido';
      isValid = false;
    }

    // Validación del campo "telefono"
    if (!formValues.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
      isValid = false;
    } else if (!/^\d{8}$/.test(formValues.telefono)) {
      errors.telefono = 'El teléfono debe tener 8 dígitos';
      isValid = false;
    }

    // Validación del campo "direccion"
    if (!formValues.direccion.trim()) {
      errors.direccion = 'La dirección es requerida';
      isValid = false;
    }

    setFormErrors(errors); // Almacenar los errores para mostrarlos en el UI
    return isValid;
  };


  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
  
    const Equipodata = {
      nombre_empresa: formValues.nombre_empresa,
      nombre_corto: formValues.nombre_corto,
      correo_empresa: formValues.correo_empresa,
      telefono: formValues.telefono,
      direccion: formValues.direccion,
      estudiantesSeleccionados: formValues.estudiantesSeleccionados.map(est => est.value),
    };
  
    try {
      if (currentEquipo) {
        await axios.put(`http://localhost:8000/api/equipos/${currentEquipo.id_empresa}`, Equipodata);
        setEquipos(prevEquipos =>
          prevEquipos.map(equipo =>
            equipo.id_empresa === currentEquipo.id_empresa ? { ...equipo, ...formValues } : equipo
          )
        );
        toast.success('Equipo editado exitosamente');
      } else {
        const response = await axios.post('http://localhost:8000/api/equipos', Equipodata);
        setEquipos([...equipos, response.data]);
        toast.success('Equipo registrado exitosamente');
      }
      handleCloseModal();
      // Actualizar la lista de estudiantes disponibles después de guardar el equipo
      fetchEstudiantes();  // Actualizar lista de estudiantes
    } catch (error) {
      // Verificar si hay una respuesta del servidor y mostrar los errores
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
                <td>{equipo.telefono}</td>
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
          <div>
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
          <div className="logo-container">
        <img src='../assets/logoALPHA.png' alt="Logo de la Empresa" className="company-logo" />
      </div>
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
