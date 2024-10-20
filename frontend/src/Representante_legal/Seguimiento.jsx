import { API_URL } from '../config';              
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './Seguimiento.css';

const Seguimiento = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Obtener la lista de estudiantes desde la API
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}listaEstudiantes`);
        const studentOptions = response.data.map(student => ({
          value: student.id_estudiante,
          label: `${student.nombre_estudiante} ${student.ap_pat} ${student.ap_mat} (${student.codigo_sis})`
        }));
        setStudents(studentOptions);
      } catch (error) {
        console.error('Error al obtener la lista de estudiantes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Obtener la lista de sprints desde la API
  useEffect(() => {
    const fetchSprints = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}sprints`);
        setSprints(response.data);
        setSelectedSprint(response.data[0]?.id_sprint || null);
      } catch (error) {
        console.error('Error al obtener los sprints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSprints();
  }, []);

  // Obtener las tareas según el sprint seleccionado
  useEffect(() => {
    if (selectedSprint) {
      const fetchTasks = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}sprints/${selectedSprint}/tareas`);
          const tasksWithResponsables = response.data.map(task => ({
            ...task,
            responsables: task.estudiantes.map(est => ({
              value: est.id_estudiante,
              label: `${est.nombre_estudiante} ${est.ap_pat} ${est.ap_mat} (${est.codigo_sis})`
            }))
          }));
          setTasks(tasksWithResponsables);
        } catch (error) {
          console.error('Error al obtener las tareas:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [selectedSprint]);

  // Manejar la selección de responsables
  const handleResponsableChange = async (selectedOptions, taskIndex) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].responsables = selectedOptions || [];
    setTasks(newTasks);

    const estudiantesIds = (selectedOptions || []).map(student => student.value);

    try {
      await axios.post(`${API_URL}tareas/${newTasks[taskIndex].id_tarea}/asignar-estudiantes`, {
        estudiantes_ids: estudiantesIds
      });
      console.log('Estudiantes actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los estudiantes:', error);
    }
  };

  // Manejar el cambio de sprint seleccionado
  const handleSprintChange = (event) => {
    setSelectedSprint(parseInt(event.target.value, 10));
  };

  return (
    <div className="planilla-seguimiento">
      <header>
        <h1>Planilla de seguimiento</h1>
      </header>

      <div className="sprint-selector">
        <label>Sprint</label>
        <select value={selectedSprint} onChange={handleSprintChange}>
          {sprints.map(sprint => (
            <option key={sprint.id_sprint} value={sprint.id_sprint}>
              {sprint.nro_sprint}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Cargando...</div>}
      {message && <div className="message">{message}</div>}

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsables</th>
            <th>Estado</th>
            <th>Progreso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id_tarea}>
              <td>{task.nombre_tarea}</td>
              <td>
                {task.responsables.length > 0 ? (
                  task.responsables.map(responsable => (
                    <div key={responsable.value}>{responsable.label}</div>
                  ))
                ) : (
                  <div>No hay responsables asignados</div>
                )}
                <Select
                  isMulti
                  options={students}
                  value={task.responsables}
                  onChange={(selectedOptions) => handleResponsableChange(selectedOptions, index)}
                  className="responsable-select"
                  placeholder="Selecciona responsables"
                />
              </td>
              <td>{task.estado}</td>
              <td>{task.progreso}</td>
              <td>
                <button
                  onClick={() => handleAssignStudents(task.id_tarea, task.responsables)}
                >
                  Asignar estudiantes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Seguimiento;
