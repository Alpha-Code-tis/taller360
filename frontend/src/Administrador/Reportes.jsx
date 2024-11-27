import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Table, Button, Alert, Spinner } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const API_URL = 'http://localhost:8000/api/'; // Cambia según tu configuración

const Reporte = () => {
  const [equipos, setEquipos] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState('');
  const [sprintSeleccionado, setSprintSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Obtener equipos de la gestión actual
  useEffect(() => {
    const fetchEquipos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}listarEmpresas/2-2024`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEquipos(response.data);
      } catch (error) {
        console.error('Error al cargar los equipos:', error);
        setError('No se pudieron cargar los equipos.');
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
  }, []);

  // Obtener sprints del equipo seleccionado
  useEffect(() => {
    if (equipoSeleccionado) {
      const fetchSprints = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}planilla/empresas/${equipoSeleccionado}/sprints`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setSprints(response.data);
        } catch (error) {
          console.error('Error al cargar los sprints:', error);
          setError('No se pudieron cargar los sprints.');
        } finally {
          setLoading(false);
        }
      };
      fetchSprints();
    } else {
      setSprints([]);
      setSprintSeleccionado('');
    }
  }, [equipoSeleccionado]);

  // Obtener tareas y evaluaciones cruzadas
  useEffect(() => {
    if (sprintSeleccionado) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [tareasResponse, evaluacionesResponse] = await Promise.all([
            axios.get(`${API_URL}sprints/${sprintSeleccionado}/tareas`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }),
            axios.get(`${API_URL}cruzada/notas/${equipoSeleccionado}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }),
          ]);
          setTareas(tareasResponse.data);
          setEvaluaciones(evaluacionesResponse.data);
        } catch (error) {
          console.error('Error al cargar los datos:', error);
          setError('No se pudieron cargar los datos.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setTareas([]);
      setEvaluaciones([]);
    }
  }, [sprintSeleccionado]);

  // Generar reporte en PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte Completo', 20, 10);

    if (tareas.length > 0) {
      doc.text('Tareas del Sprint:', 10, 20);
      const tareasData = tareas.map((tarea) => [
        tarea.nombre_tarea,
        tarea.estado,
        `${tarea.progreso}%`,
        tarea.estudiantes.map((est) => est.nombre_estudiante).join(', '),
      ]);
      doc.autoTable({
        head: [['Tarea', 'Estado', 'Progreso', 'Responsables']],
        body: tareasData,
        startY: 30,
      });
    }

    if (evaluaciones.length > 0) {
      doc.text('Evaluaciones Cruzadas:', 10, doc.previousAutoTable.finalY + 10);
      const evaluacionesData = evaluaciones.map((evaluacion) => [
        evaluacion.criterio_nombre,
        evaluacion.nota,
      ]);
      doc.autoTable({
        head: [['Criterio', 'Nota']],
        body: evaluacionesData,
        startY: doc.previousAutoTable.finalY + 20,
      });
    }

    doc.save('reporte.pdf');
  };

  return (
    <div className="container mt-4">
      <h1>Reporte de Seguimiento y Evaluación Cruzada</h1>

      {error && <Alert variant="danger">{error}</Alert>}

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

        <Form.Group className="mt-3">
          <Form.Label>Sprint</Form.Label>
          <Form.Select
            value={sprintSeleccionado}
            onChange={(e) => setSprintSeleccionado(e.target.value)}
            aria-label="Seleccionar sprint"
          >
            <option value="">Seleccione un sprint</option>
            {sprints.map((sprint) => (
              <option key={sprint.id_sprint} value={sprint.id_sprint}>
                Sprint {sprint.nro_sprint}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>

      {loading && <Spinner animation="border" />}

      {tareas.length > 0 && (
        <div className="mt-4">
          <h3>Tareas del Sprint Seleccionado</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Progreso</th>
                <th>Responsables</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id_tarea}>
                  <td>{tarea.nombre_tarea}</td>
                  <td>{tarea.estado}</td>
                  <td>{tarea.progreso}%</td>
                  <td>
                    {tarea.estudiantes.map((est) => est.nombre_estudiante).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {evaluaciones.length > 0 && (
        <div className="mt-4">
          <h3>Evaluaciones Cruzadas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Criterio</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map((evaluacion, index) => (
                <tr key={index}>
                  <td>{evaluacion.criterio_nombre}</td>
                  <td>{evaluacion.nota}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {(tareas.length > 0 || evaluaciones.length > 0) && (
        <Button variant="primary" className="mt-4" onClick={generarPDF}>
          Generar PDF
        </Button>
      )}
    </div>
  );
};

export default Reporte;
