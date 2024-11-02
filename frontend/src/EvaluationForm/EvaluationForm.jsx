import React, { useState, useEffect } from 'react';

const EvaluationForm = () => {
  const initialMembers = [
    { name: 'Miembro 1', tasks: '', score: '', comments: '', reviewed: false },
    { name: 'Miembro 2', tasks: '', score: '', comments: '', reviewed: false },
  ];
  
  const [team, setTeam] = useState('');
  const [sprint, setSprint] = useState('');
  const [week, setWeek] = useState('');
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewedWeeks, setReviewedWeeks] = useState([]); // Semanas revisadas
  const [members, setMembers] = useState(initialMembers); // Inicializamos con los valores iniciales
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si todos los miembros están revisados
    const allReviewed = members.every(member => member.reviewed);
    setIsReviewed(allReviewed);
  }, [members]);

  useEffect(() => {
    // Cuando cambias de semana, reinicia los datos de miembros si la semana no fue revisada
    if (week && !reviewedWeeks.includes(week)) {
      setMembers(initialMembers.map(member => ({ ...member }))); // Reinicia miembros a valores iniciales
    }
  }, [week]);

  const handleSave = () => {
    const incomplete = members.some(member => !member.tasks || !member.score || !member.comments);
    if (!team || !week || !sprint || incomplete) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    // Agregar la semana actual a reviewedWeeks si está completamente revisada y guardada
    setReviewedWeeks(prevReviewedWeeks => {
      if (!prevReviewedWeeks.includes(week)) {
        return [...prevReviewedWeeks, week];
      }
      return prevReviewedWeeks;
    });

    console.log('Datos guardados:', { team, sprint, week, members });
    alert('¡Evaluación guardada con éxito!');
  };

  const handleCancel = () => {
    alert('Cambios cancelados');
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Evaluación de Equipo</h2>
      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Equipo:</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar equipo</option>
          <option value="Alpha Code">Alpha Code</option>
          <option value="Code Soft">Code Soft</option>
        </select>
      </div>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Sprint:</label>
        <select value={sprint} onChange={(e) => setSprint(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar sprint</option>
          <option value="1">1</option>
          <option value="2">2</option>
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
          {[1, 2, 3, 4].map(num => (
            <option 
              key={num} 
              value={num.toString()} 
              style={{ 
                backgroundColor: reviewedWeeks.includes(num.toString()) ? '#d4edda' : '#fff', 
                color: reviewedWeeks.includes(num.toString()) ? '#155724' : '#000' 
              }}
            >
              {num}
            </option>
          ))}
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Nombre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Tareas Completadas</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Calificación</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Comentarios</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#333', backgroundColor: '#eaeaea' }}>Revisado</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333' }}>{member.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input
                  type="text"
                  value={member.tasks}
                  onChange={(e) => handleMemberChange(index, 'tasks', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}
                />
              </td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <input
                  type="number"
                  value={member.score}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, e.target.value));
                    handleMemberChange(index, 'score', value);
                  }}
                  min="0"
                  max="100"
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
        <button onClick={handleCancel} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#f5f5f5', color: '#333', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>Cancelar</button>
        <button onClick={handleSave} style={{ padding: '10px 20px', border: 'none', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>Guardar</button>
      </div>
    </div>
  );
};

export default EvaluationForm;
