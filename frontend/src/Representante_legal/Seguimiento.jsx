import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Seguimiento.css';

const Seguimiento = () => {
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [loading, setLoading] = useState(false); // Solo un estado de carga
  const [hasLoaded, setHasLoaded] = useState(false); // Estado para verificar si los datos ya se cargaron

  // Cargar datos iniciales (Estudiantes y Sprints)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (hasLoaded) return; // Si los datos ya se cargaron, no ejecuta nuevamente el toast
      setLoading(true);

      try {
        // Mostrar solo un mensaje de carga para todo el proceso
        toast.loading('Cargando información...', { id: 'loading-info' });
        
        // Promesas para cargar tanto estudiantes como sprints
        const [studentsResponse, sprintsResponse] = await Promise.all([
          axios.get(`${API_URL}listaEstudiantes`),
          axios.get(`${API_URL}sprints`)
        ]);
        
        const studentOptions = studentsResponse.data.map((student) => ({
          value: student.id_estudiante,
          label: `${student.nombre_estudiante} ${student.ap_pat} ${student.ap_mat} (${student.codigo_sis})`,
        }));

        setStudents(studentOptions);
        setSprints(sprintsResponse.data);
        setSelectedSprint(sprintsResponse.data[0]?.id_sprint || null);

        // Ahora cargamos las tareas del primer sprint
        if (sprintsResponse.data.length > 0) {
          const tasksResponse = await axios.get(
            `${API_URL}sprints/${sprintsResponse.data[0].id_sprint}/tareas`
          );
          const tasksWithResponsables = tasksResponse.data.map((task) => ({
            ...task,
            responsables: task.estudiantes.map((est) => ({
              value: est.id_estudiante,
              label: `${est.nombre_estudiante} ${est.ap_pat} ${est.ap_mat} (${est.codigo_sis})`,
            })),
          }));
          setTasks(tasksWithResponsables);
        }
        
        toast.success('Información cargada correctamente', { id: 'loading-info' });
        setHasLoaded(true); // Datos cargados correctamente
      } catch (error) {
        toast.error('Error al cargar la información', { id: 'loading-info' });
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false); // Terminar la carga
      }
    };

    fetchInitialData();
  }, [hasLoaded]); // Solo se ejecuta si los datos no han sido cargados previamente

  // Manejar la actualización de responsables en las tareas
  const handleResponsableChange = async (selectedOptions, taskIndex) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].responsables = selectedOptions || [];
    setTasks(newTasks);

    const estudiantesIds = (selectedOptions || []).map((student) => student.value);

    try {
      await toast.promise(
        axios.post(
          `${API_URL}tareas/${newTasks[taskIndex].id_tarea}/asignar-estudiantes`,
          { estudiantes_ids: estudiantesIds }
        ),
        {
          loading: 'Actualizando responsables...',
          success: 'Responsables actualizados correctamente',
          error: 'Error al actualizar responsables',
        }
      );
    } catch (error) {
      console.error('Error al actualizar estudiantes:', error);
    }
  };

  // Manejar el cambio de sprint seleccionado
  const handleSprintChange = (event) => {
    setSelectedSprint(parseInt(event.target.value, 10));
    setLoading(true);
    toast.loading('Cargando información del sprint...', { id: 'loading-sprint' });

    // Cargar tareas del nuevo sprint seleccionado
    axios
      .get(`${API_URL}sprints/${event.target.value}/tareas`)
      .then((response) => {
        const tasksWithResponsables = response.data.map((task) => ({
          ...task,
          responsables: task.estudiantes.map((est) => ({
            value: est.id_estudiante,
            label: `${est.nombre_estudiante} ${est.ap_pat} ${est.ap_mat} (${est.codigo_sis})`,
          })),
        }));
        setTasks(tasksWithResponsables);
        toast.success('Informacion cargada correctamente', { id: 'loading-sprint' });
      })
      .catch(() => {
        toast.error('Error al cargar las tareas del sprint', { id: 'loading-sprint' });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="planilla-seguimiento">
      <header>
        <h1>Planilla de seguimiento</h1>
      </header>

      <div className="sprint-selector">
        <label>Sprint</label>
        <select value={selectedSprint} onChange={handleSprintChange}>
          {sprints.map((sprint) => (
            <option key={sprint.id_sprint} value={sprint.id_sprint}>
              {sprint.nro_sprint}
            </option>
          ))}
        </select>
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsables</th>
            <th>Estado</th>
            <th>Progreso</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id_tarea}>
              <td>{task.nombre_tarea}</td>
              <td>
                {task.responsables.length > 0 ? (
                  task.responsables.map((responsable) => (
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
            </tr>
          ))}
        </tbody>
      </table>

      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '16px',
          },
        }}
      />
    </div>
  );
};

export default Seguimiento;