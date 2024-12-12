import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GenerarPlanilla.css';
import { API_URL } from '../config'; 

function GenerarPlanilla() {
  // Estados para la planilla
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState('');
  const [sprints, setSprints] = useState([]);
  const [sprint, setSprint] = useState('');
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  // Estados para el modal
  const [imagenes, setImagenes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Obtener equipos al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_URL}evaluation/form`);
        setTeams(response.data.empresas);
        console.log('Equipos:', response.data.empresas);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };
    fetchTeams();
  }, []);

  // Obtener sprints cuando cambia el equipo seleccionado
  useEffect(() => {
    if (team) {
      const fetchSprints = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/sprints/${team}`);
          setSprints(response.data);
          console.log('Sprints:', response.data);
        } catch (error) {
          console.error('Error al obtener sprints:', error);
        }
      };
      fetchSprints();
    } else {
      setSprints([]);
      setSprint('');
    }
  }, [team]);

  // Obtener tareas cuando cambia el sprint seleccionado
  useEffect(() => {
    if (sprint) {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/tareas/${team}/sprint/${sprint}`);
          setTasks(response.data);
          console.log('Tareas:', response.data);

          // Si necesitas usar 'members' para otra funcionalidad
          setMembers(
            response.data.map(task => ({
              id_tarea: task.id_tarea,
              name: task.responsables,
              tasks: task.nombre_tarea,
              score: '',
              comments: '',
              reviewed: false,
            }))
          );
        } catch (error) {
          console.error('Error al obtener tareas:', error);
        }
      };
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [sprint]);

  // Función para actualizar el progreso de una tarea
  const actualizarProgreso = (index, idTarea, nuevoProgreso) => {
    axios.put(`${API_URL}evaluation/planilla/tareas/${idTarea}/actualizar-progreso`, { progreso: nuevoProgreso })
      .then(response => {
        // Update the tasks state after successful update
        const updatedTasks = [...tasks];
        updatedTasks[index].progreso = nuevoProgreso;

        // Update task state based on progress
        if (nuevoProgreso === 0) {
          updatedTasks[index].estado = 'Pendiente';
        } else if (nuevoProgreso > 0 && nuevoProgreso < 100) {
          updatedTasks[index].estado = 'En progreso';
        } else if (nuevoProgreso === 100) {
          updatedTasks[index].estado = 'Terminado';
        }

        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Error al actualizar el progreso:', error);
      });
  };


  // Función para ver enlaces de un documento relacionado a una tarea
  const verImagenes = (idTarea) => {
    axios.get(`${API_URL}evaluation/planilla/tareas/${idTarea}/ver-avances`)
      .then(response => {
        setImagenes(response.data); // Assuming response.data contains an array of document URLs
        setMostrarModal(true);
      })
      .catch(error => {
        console.error('Error al obtener los enlaces de los documentos:', error);
      });
  };


  // Función para cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setImagenes([]);
  };

  return (
    <div className="generar-planilla">
      <h2>Planilla Semanal</h2>
      <div className="filters">
        <div className="filter">
          <label>Empresa</label>
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: '#000',
            }}
          >
            <option value="">Selecciona una empresa</option>
            {teams.map((team) => (
              <option key={team.id_empresa} value={team.id_empresa}>
                {team.nombre_empresa}
              </option>
            ))}
          </select>
        </div>
        <div className="filter">
          <label>Sprint</label>
          <select
            value={sprint}
            onChange={(e) => setSprint(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
              backgroundColor: '#fff',
              color: '#000',
            }}
          >
            <option value="">Selecciona un sprint</option>
            {sprints.map((sprint) => (
              <option key={sprint.id_sprint} value={sprint.id_sprint}>
                {sprint.nro_sprint}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="planilla-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Progreso</th>
            <th>Vista</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((item, index) => (
            <tr key={item.id_tarea}>
              <td>{item.nombre_tarea}</td>
              <td>{item.responsables}</td>
              <td>{item.estado}</td>
              <td>
                <select
                  value={item.progreso}
                  onChange={(e) => {
                    const nuevoProgreso = parseInt(e.target.value);
                    actualizarProgreso(index, item.id_tarea, nuevoProgreso);
                  }}
                >
                  <option value="0">0 %</option>
                  <option value="20">20 %</option>
                  <option value="40">40 %</option>
                  <option value="60">60 %</option>
                  <option value="80">80 %</option>
                  <option value="100">100 %</option>
                </select>
              </td>
              <td>
                <button className="view-button" onClick={() => verImagenes(item.id_tarea)}>
                  👁️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>
              &times;
            </span>
            <h3>Enlaces a los Documentos de la Tarea</h3>
            <div className="enlaces-grid">
              {imagenes.length > 0 ? (
                imagenes.map((doc, index) => (
                  <div key={index}>
                    <a href={doc} target="_blank" rel="noopener noreferrer">
                      Ver Documento {index + 1}
                    </a>
                  </div>
                ))
              ) : (
                <p>No hay documentos disponibles para esta tarea.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default GenerarPlanilla;
