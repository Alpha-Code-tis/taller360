import React, { useState } from 'react';

const EvaluationForm = () => {
  const [team, setTeam] = useState('');
  const [sprint, setSprint] = useState('');
  const [week, setWeek] = useState('');
  const [members, setMembers] = useState([
    { name: 'Miembro 1', tasks: '', score: '', comments: '', reviewed: false },
    { name: 'Miembro 2', tasks: '', score: '', comments: '', reviewed: false },
  ]);
  const [error, setError] = useState('');

  const handleSave = () => {
    const incomplete = members.some(member => !member.tasks || !member.score || !member.comments);
    if (!team || !week || !sprint || incomplete) {
      setError('Por favor, complete todos los campos.');
      return;
    }
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
        <select value={week} onChange={(e) => setWeek(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar semana</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Nombre</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Tareas Completadas</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Calificación</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Comentarios</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333', backgroundColor: '#eaeaea' }}>Revisado</th>
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
                        const value = Math.min(100, Math.max(0, e.target.value)); // Limita el valor entre 0 y 100
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
                    <div style={{ display: 'flex', justifyContent: 'center', transform: 'scale(1.5)', transformOrigin: 'left' }}>
                    <input
                        type="checkbox"
                        checked={member.reviewed}
                        onChange={(e) => handleMemberChange(index, 'reviewed', e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    </div>
                </td>
                </tr>
            ))}
            </tbody>

      </table>

      {error && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={handleSave} style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff' }}>Guardar</button>
        <button onClick={handleCancel} style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#6c757d', color: '#fff' }}>Cancelar</button>
      </div>
    </div>
  );
};

export default EvaluationForm;
