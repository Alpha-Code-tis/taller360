import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config'; // Asegúrate de que la URL de tu API esté configurada correctamente
import { Spinner, Table, Card, ListGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import './Reportes.css';

const Reportes = () => {
  const [empresas, setEmpresas] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [sprintSeleccionado, setSprintSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(`${API_URL}empresa/gestion/2-2024`);
        setEmpresas(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleEquipoSeleccionado = (equipo) => {
    setEquipoSeleccionado(equipo);
    setSprintSeleccionado(null); // Reinicia el filtro de sprint al cambiar el equipo
  };

  const handleSprintSeleccionado = (sprint) => {
    setSprintSeleccionado(sprint);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error al cargar los datos.</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Reporte de Gestión 2-2024</h1>

      {/* Filtros */}
      <div className="mb-4 d-flex align-items-center">
        <DropdownButton
          id="dropdown-equipos"
          title={equipoSeleccionado ? equipoSeleccionado.nombre_equipo : "Seleccionar Equipo"}
          className="me-3"
        >
          {empresas.map((empresa) =>
            empresa.equipos.map((equipo) => (
              <Dropdown.Item
                key={equipo.id_equipo}
                onClick={() => handleEquipoSeleccionado(equipo)}
              >
                {equipo.nombre_equipo}
              </Dropdown.Item>
            ))
          )}
        </DropdownButton>

        <DropdownButton
          id="dropdown-sprints"
          title={sprintSeleccionado ? `Sprint ${sprintSeleccionado.nro_sprint}` : "Seleccionar Sprint"}
          disabled={!equipoSeleccionado}
        >
          {equipoSeleccionado?.sprints.map((sprint) => (
            <Dropdown.Item
              key={sprint.id_sprint}
              onClick={() => handleSprintSeleccionado(sprint)}
            >
              Sprint {sprint.nro_sprint}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>

      {/* Detalle de la Empresa */}
      {equipoSeleccionado && sprintSeleccionado && (
        <>
          <Card className="mb-4">
            <Card.Header>Información de la Empresa</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Nombre:</strong> {equipoSeleccionado.empresa.nombre_empresa}
              </Card.Text>
              <Card.Text>
                <strong>Dirección:</strong> {equipoSeleccionado.empresa.direccion}
              </Card.Text>
              <Card.Text>
                <strong>Teléfono:</strong> {equipoSeleccionado.empresa.telefono}
              </Card.Text>
              <Card.Text>
                <strong>Correo:</strong> {equipoSeleccionado.empresa.correo_empresa}
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Detalle del Sprint */}
          <Card className="mb-4">
            <Card.Header>Sprint {sprintSeleccionado.nro_sprint}</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Fecha Inicio:</strong> {sprintSeleccionado.fecha_inicio}
              </Card.Text>
              <Card.Text>
                <strong>Fecha Fin:</strong> {sprintSeleccionado.fecha_fin}
              </Card.Text>
              <Card.Text>
                <strong>Porcentaje:</strong> {sprintSeleccionado.porcentaje}%
              </Card.Text>

              {/* Tareas */}
              {sprintSeleccionado.alcances && sprintSeleccionado.alcances.length > 0 ? (
                sprintSeleccionado.alcances.map((alcance) => (
                  <div key={alcance.id_alcance}>
                    <Card.Title>Requerimiento: {alcance.descripcion}</Card.Title>
                    {alcance.tareas && alcance.tareas.length > 0 ? (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Nombre Tarea</th>
                            <th>Estimación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {alcance.tareas.map((tarea) => (
                            <tr key={tarea.id_tarea}>
                              <td>{tarea.nombre_tarea}</td>
                              <td>{tarea.estimacion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p>No hay tareas para este alcance.</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No hay alcances para este sprint.</p>
              )}
            </Card.Body>
          </Card>

          {/* Evaluaciones Cruzadas */}
          <Card className="mb-4">
            <Card.Header>Evaluaciones Cruzadas</Card.Header>
            {equipoSeleccionado.evaluaciones_cruzadas &&
            equipoSeleccionado.evaluaciones_cruzadas.length > 0 ? (
              equipoSeleccionado.evaluaciones_cruzadas.map((evaluacion) => (
                <Card className="mb-3" key={evaluacion.id_cruzada}>
                  <Card.Body>
                    <Card.Text>
                      <strong>Evaluador:</strong> {evaluacion.evaluador.nombre_empresa}
                    </Card.Text>
                    <Card.Text>
                      <strong>Nota Total:</strong> {evaluacion.nota_cruzada}
                    </Card.Text>
                    {/* Detalle de notas por criterio */}
                    {evaluacion.detalle_notas && (
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Criterio</th>
                            <th>Nota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {evaluacion.detalle_notas.map((detalle, index) => (
                            <tr key={index}>
                              <td>{detalle.criterio_nombre}</td>
                              <td>{detalle.nota}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Card.Body>
                <p>No hay evaluaciones cruzadas disponibles.</p>
              </Card.Body>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Reportes;
