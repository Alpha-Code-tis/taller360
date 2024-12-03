import React, { useState, useEffect } from "react";
import axios from "axios";

const EvaluationTables = () => {
  const [teams, setTeams] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");
  const [grades, setGrades] = useState([]);
  const [evaluacionDocente, setEvaluacionDocente] = useState(0);
  const [pares, setPares] = useState(0);
  const [autoevaluacion, setAutoevaluacion] = useState(0);
  const [notaTotal, setNotaTotal] = useState(0);
  const [error, setError] = useState("");

  const API_URL = 'http://localhost:8000/api';

  // Obtener equipos al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_URL}/equipos1`);
        console.log("Equipos:", response.data.empresas); // Verificar los datos recibidos
        setTeams(response.data.empresas);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
        setError('Error al obtener equipos.');
      }
    };
    fetchTeams();
  }, []);

  // Obtener sprints cuando se selecciona un equipo
  useEffect(() => {
    if (selectedTeam) {
      const fetchSprints = async () => {
        try {
          const response = await axios.get(`${API_URL}/evaluation/sprints/${selectedTeam}`);
          console.log("Sprints:", response.data); // Verificar los datos recibidos
          setSprints(response.data);
        } catch (error) {
          console.error("Error al obtener sprints:", error);
          setError("Error al obtener sprints.");
        }
      };
      fetchSprints();
    } else {
      setSprints([]);
      setSelectedSprint("");
    }
  }, [selectedTeam]);

  // Obtener notas y otros valores cuando se selecciona equipo y sprint
  useEffect(() => {
    if (selectedTeam && selectedSprint) {
      const fetchGradesAndValues = async () => {
        try {
          const response = await axios.get(`${API_URL}/equipos/${selectedTeam}/sprints/${selectedSprint}/sumatoria-notas`);
          console.log("Respuesta de API (sumatoria-notas):", response.data); // Verificar la respuesta de la API

          if (response.data) {
            // Asignar las notas de los estudiantes
            setGrades(response.data.notasEstudiantes || []);

            // Actualizar valores dinámicos de la evaluación docente, pares, autoevaluación, y nota total
            setEvaluacionDocente(response.data.evaluacionDocente || 0);
            setPares(response.data.pares || 0);
            setAutoevaluacion(response.data.autoevaluacion || 0);
            setNotaTotal(response.data.notaTotal || 0);
          } else {
            setGrades([]);
            console.error("La respuesta de la API no contiene datos válidos.");
          }
        } catch (error) {
          console.error("Error al obtener las notas:", error);
          setError("Error al obtener las notas.");
        }
      };
      fetchGradesAndValues();
    } else {
      setGrades([]);
      setEvaluacionDocente(0);
      setPares(0);
      setAutoevaluacion(0);
      setNotaTotal(0);
    }
  }, [selectedTeam, selectedSprint]);

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedSprint("");
    setGrades([]);
    setEvaluacionDocente(0);
    setPares(0);
    setAutoevaluacion(0);
    setNotaTotal(0);
  };

  const handleSprintChange = (e) => {
    setSelectedSprint(e.target.value);
    setGrades([]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Evaluación de Equipo</h2>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Equipo:</label>
        <select value={selectedTeam} onChange={handleTeamChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar equipo</option>
          {teams.map((team) => (
            <option key={team.id_empresa} value={team.id_empresa}>{team.nombre_empresa}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Sprint:</label>
        <select value={selectedSprint} onChange={handleSprintChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
          <option value="">Seleccionar sprint</option>
          {sprints.map((sprint) => (
            <option key={sprint.id_sprint} value={sprint.id_sprint}>{sprint.nro_sprint}</option>
          ))}
        </select>
      </div>

      {/* Tabla para mostrar y editar los miembros */}
      {grades.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Nombre</th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Evaluación </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Ev. Pares </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#fff', backgroundColor: '#1A3254' }}>Autoevaluación </th>
              <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center', color: '#fff', backgroundColor: '#1A3254' }}>Nota Total </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((member, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left', color: '#333' }}>{member.nombre} {member.apellidos}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{member.notaTarea}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{member.notaEvPares}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{member.notaAutoEv}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{member.notaTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>
          {selectedTeam && selectedSprint ? 'No hay notas disponibles.' : 'Seleccione un equipo y sprint para ver las notas.'}
        </p>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default EvaluationTables;
