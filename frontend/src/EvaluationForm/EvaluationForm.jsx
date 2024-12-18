import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const EvaluationForm = () => {
  const [teams, setTeams] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState('');
  const [sprint, setSprint] = useState('');
  const [week, setWeek] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewedWeeks, setReviewedWeeks] = useState([]);
  const [members, setMembers] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [error, setError] = useState('');

  // Obtener el token de autenticación (ajusta según tu implementación)
  const token = localStorage.getItem('token');

  // Cargar las empresas al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_URL}evaluation/form`);
        setTeams(response.data.empresas);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };
    fetchTeams();
  }, []);

  // Obtener sprints cuando se seleccione un equipo
  useEffect(() => {
    if (team) {
      const fetchSprints = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/sprints/${team}`);
          setSprints(response.data);
        } catch (error) {
          console.error('Error al obtener sprints:', error);
        }
      };
      fetchSprints();
    }
  }, [team]);

  // Obtener el porcentaje del sprint seleccionado
  useEffect(() => {
    if (sprint) {
      const fetchSprintPercentage = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/sprint/${sprint}`);
          setPercentage(response.data.porcentaje);
        } catch (error) {
          console.error('Error al obtener el porcentaje del sprint:', error);
        }
      };
      fetchSprintPercentage();
    }
  }, [sprint]);

  // Obtener semanas del sprint seleccionado
  useEffect(() => {
    if (sprint) {
      const fetchWeeks = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/weeks/${sprint}`);
          setWeeks(response.data);
        } catch (error) {
          console.error('Error al obtener semanas:', error);
        }
      };
      fetchWeeks();
    }
  }, [sprint]);

  useEffect(() => {
    const loadData = async () => {
      if (team && sprint && week) {
        // Convertir week a número si reviewedWeeks son números
        const weekNumber = parseInt(week, 10);
setReviewedWeeks(prev => {
  if (!prev.includes(weekNumber)) {
    return [...prev, weekNumber];
  }
  return prev;
});
        if (reviewedWeeks.includes(weekNumber)) {
          // Semana revisada: cargar datos guardados
          try {
            const response = await axios.get(`${API_URL}evaluation/reviewed-week/${sprint}/${weekNumber}`);
            const reviewedMembers = response.data.map(detalle => ({
              id_tarea: detalle.id_tarea,
              name: detalle.nom_estudiante,
              tasks: detalle.nom_tarea,
              score: parseInt(detalle.calificacion_tarea.split(' / ')[0], 10),
              comments: detalle.observaciones_tarea,
              reviewed: detalle.revisado_tarea ? true : false
            }));
            setMembers(reviewedMembers);
          } catch (error) {
            console.error('Error al obtener la semana revisada:', error);
          }
        } else {
          // Semana no revisada: cargar tareas y mostrarlas vacías
          try {
            const response = await axios.get(`${API_URL}evaluation/tareas/${team}/sprint/${sprint}`);
            const fetchedTasks = response.data;
            setTasks(fetchedTasks);
            setMembers(fetchedTasks.map(task => ({
              id_tarea: task.id_tarea,
              name: task.responsables,
              tasks: task.nombre_tarea,
              score: '',
              comments: '',
              reviewed: false,
            })));
          } catch (error) {
            console.error('Error al obtener tareas:', error);
          }
        }
      }
    };

    loadData();
    // Elimina `tasks` de las dependencias
  }, [week, reviewedWeeks, team, sprint, API_URL]);

  const handleSave = async () => {
    const incomplete = members.some(member => !member.tasks || !member.score || !member.comments);
    if (!team || !week || !sprint || incomplete) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}evaluation/save`, {
        tareas: members.map(member => ({
          id_tarea: member.id_tarea,
          name: member.name,
          tasks: member.tasks,
          score: member.score,
          comments: member.comments,
          calificacion: parseInt(member.score, 10),
          revisado: member.reviewed ? true : false,
        })),
        sprint_id: sprint,
        week: week,
        week_revisado: isReviewed,
      });
      alert('¡Evaluación guardada con éxito!');

      // Agregar semana revisada localmente
      setReviewedWeeks(prev => {
        if (!prev.includes(week)) {
          return [...prev, week];
        }
        return prev;
      });
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
    }
  };

  const handleCancel = () => {
    alert('Cambios cancelados');
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    if (field === 'reviewed') {
      newMembers[index][field] = value === true || value === 'true';
    } else {
      newMembers[index][field] = value;
    }
    setMembers(newMembers);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Evaluación de Equipo</h2>
      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Equipo:</label>
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
            color: '#000'
          }}
        >
          <option value="">Seleccionar equipo</option>
          {teams.map((team) => (
            <option key={team.id_empresa} value={team.id_empresa}>{team.nombre_empresa}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Sprint:</label>
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
            color: '#000'
          }}
        >
          <option value="">Seleccionar sprint</option>
          {sprints.map((s) => (
            <option key={s.id_sprint} value={s.id_sprint}>{s.nro_sprint}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Semana:</label>
        <select
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            color: '#000'
          }}
        >
          <option value="">Seleccionar semana</option>
          {weeks.map((w) => (
            <option
              key={w}
              value={w.toString()}
              style={{
                backgroundColor: reviewedWeeks.includes(w.toString()) ? '#d4edda' : '#fff',
                color: reviewedWeeks.includes(w.toString()) ? '#155724' : '#000',
              }}
            >
              {w}
            </option>
          ))}
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Nombre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Tareas Completadas</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Calificación (/ {percentage})</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Comentarios</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#fff', backgroundColor: '#1A3254' }}>Revisado</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333' }}>{member.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{member.tasks}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input
                  type="number"
                  value={member.score || ''}
                  onChange={(e) => handleMemberChange(index, 'score', e.target.value)}
                  min="0"
                  max={percentage}
                  style={{
                    width: '100%', padding: '8px', border: '1px solid #ccc',
                    borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000'
                  }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input
                  type="text"
                  value={member.comments || ''}
                  onChange={(e) => handleMemberChange(index, 'comments', e.target.value)}
                  style={{
                    width: '100%', padding: '8px', border: '1px solid #ccc',
                    borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000'
                  }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={member.reviewed}
                  onChange={(e) => handleMemberChange(index, 'reviewed', e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleCancel}
          style={{
            padding: '10px 20px', border: 'none', backgroundColor: '#6c757d',
            color: '#ddd', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginRight: '80px'
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px', border: 'none', backgroundColor: '#007bff',
            color: '#fff', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EvaluationForm;
