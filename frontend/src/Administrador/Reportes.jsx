import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Spinner, Table } from 'react-bootstrap';

const Reportes = () => {
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState('');

  // Cargar la lista de equipos desde el backend
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const responseEquipos = await axios.get(`${API_URL}equipos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEquipos(response.data);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        setError('No se pudo cargar la lista de equipos.');
      }
    };

    fetchEquipos();
  }, []);

  const generarReporte = async () => {
    setLoading(true);
    setError('');
    try {
      const responseReporte = await axios.post(`${API_URL}reporte`, data, {
        id_empresa: equipoSeleccionado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        sprint_id: sprintId,
      });
      setReporte(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error al generar el reporte. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Generar Reporte por Equipo</h1>
      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Equipo</Form.Label>
          <Form.Select
            value={equipoSeleccionado}
            onChange={(e) => setEquipoSeleccionado(e.target.value)}
            aria-label="Seleccionar equipo"
          >
            <option value="">Seleccione un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id_empresa} value={equipo.id_empresa}>
                {equipo.nombre_empresa}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Sprint ID</Form.Label>
          <Form.Control
            type="text"
            value={sprintId}
            onChange={(e) => setSprintId(e.target.value)}
            placeholder="Ingrese el numero del sprint (opcional)"
          />
        </Form.Group>
        <Button variant="primary" onClick={generarReporte} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Generar Reporte'}
        </Button>
      </Form>

      {error && <div className="alert alert-danger">{error}</div>}

      {reporte && (
        <div>
          <h2>Reporte del Equipo: {reporte.equipo}</h2>
          <h3>Tareas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reporte.tareas.map((tarea) => (
                <tr key={tarea.id_tarea}>
                  <td>{tarea.id_tarea}</td>
                  <td>{tarea.nombre_tarea}</td>
                  <td>{tarea.estado}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h3>Sprints</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {reporte.sprint.map((sprint) => (
                <tr key={sprint.id_sprint}>
                  <td>{sprint.id_sprint}</td>
                  <td>{sprint.nombre_sprint}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Reportes;
