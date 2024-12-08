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

  // Obtener el token de autenticación (ajusta esto según cómo manejes la autenticación)
  const token = localStorage.getItem('token');


  // Obtener equipos (empresas) al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_URL}evaluation/form`);
        setTeams(response.data.empresas); // Asegúrate de obtener el objeto correcto según la respuesta del controlador
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      }
    };
    fetchTeams();
  }, []);

  // Obtener sprints de un equipo seleccionado
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
          setPercentage(response.data.porcentaje); // Asigna el porcentaje obtenido al estado
        } catch (error) {
          console.error('Error al obtener el porcentaje del sprint:', error);
        }
      };
      fetchSprintPercentage();
    }
  }, [sprint]);

  // Obtener semanas de un sprint seleccionado
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

  // Obtener tareas de un equipo seleccionado
  useEffect(() => {
    if (sprint) {
      console.log(sprint);
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`${API_URL}evaluation/tareas/${team}/sprint/${sprint}`);
          console.log(response.data)
          setTasks(response.data);
          setMembers(
            response.data.map(task => ({
              id_tarea: task.id_tarea,
              name: task.responsables,
              tasks: task.nombre_tarea,
              score: task.calificacion,
              comments: task.observaciones,
              reviewed: task.revisado,
            }))
          );
        } catch (error) {
          console.error('Error al obtener tareas:', error);
        }
      };
      fetchTasks();
    }
  }, [sprint]);

  useEffect(() => {
    // Verificar si todos los miembros están revisados
    const allReviewed = members.every(member => member.reviewed);
    setIsReviewed(allReviewed);
  }, [members]);

  useEffect(() => {
    // Cuando cambias de semana, reinicia los datos de miembros si la semana no fue revisada
    if (week && !reviewedWeeks.includes(week)) {
      setMembers(tasks.map(task => ({
        id_tarea: task.id_tarea,
        name: task.responsables,
        tasks: task.nombre_tarea,
        score: '',
        comments: '',
        reviewed: false,
      })));
    }
  }, [week]);

  const handleSave = async () => {
    const incomplete = members.some(member => !member.tasks || !member.score || !member.comments);
    if (!team || !week || !sprint || incomplete) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    console.log(members);

    try {
      const response = await axios.post(`${API_URL}evaluation/save`, {
        tareas: members.map(member => ({
          id_tarea: member.id_tarea,
          name: member.name,
          tasks: member.tasks,
          score: member.score,
          comments: member.comments,
          calificacion: `${member.score} / ${percentage}`, // Formato "calificación / porcentaje"
          revisado: member.reviewed ? true : false, // Asegurar que revisado siempre sea booleano
        })),
        sprint_id: sprint,
        week: week,
        week_revisado: isReviewed,
      });
      console.log('Datos guardados:', response.data);
      alert('¡Evaluación guardada con éxito!');

      // Agregar la semana actual a reviewedWeeks si está completamente revisada y guardada
      setReviewedWeeks(prevReviewedWeeks => {
        if (!prevReviewedWeeks.includes(week)) {
          return [...prevReviewedWeeks, week];
        }
        return prevReviewedWeeks;
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
      newMembers[index][field] = value === true || value === 'true'; // Garantiza que el valor sea booleano
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
        <select value={team} onChange={(e) => setTeam(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar equipo</option>
          {teams.map((team) => (
            <option key={team.id_empresa} value={team.id_empresa}>{team.nombre_empresa}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Sprint:</label>
        <select value={sprint} onChange={(e) => setSprint(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar sprint</option>
          {sprints.map((sprint) => (
            <option key={sprint.id_sprint} value={sprint.id_sprint}>{sprint.nro_sprint}</option>
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
            color: '#000',
          }}
        >
          <option value="">Seleccionar semana</option>
          {weeks.map((week) => (
            <option
              key={week}
              value={week.toString()}
              style={{
                backgroundColor: reviewedWeeks.includes(week.toString()) ? '#d4edda' : '#fff',
                color: reviewedWeeks.includes(week.toString()) ? '#155724' : '#000',
              }}
            >
              {week}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla para mostrar y editar los miembros */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Nombre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Tareas Completadas</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Calificación (sobre {percentage})</th>
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
                  value={member.score}
                  onChange={(e) => handleMemberChange(index, 'score', e.target.value)}
                  min="0"
                  max={percentage}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input
                  type="text"
                  value={member.comments}
                  onChange={(e) => handleMemberChange(index, 'comments', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}
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
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#6c757d',
            color: '#ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginRight: '80px',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
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
