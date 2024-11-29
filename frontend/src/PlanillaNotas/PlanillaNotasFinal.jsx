import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlanillaNotasFinal.css";

// Configurar la URL base para Axios
axios.defaults.baseURL = 'http://localhost:8000/api';

const FinalGradeTable = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [maxSprintScore, setMaxSprintScore] = useState(0); // Valor editable para Nota Sprint
  const [maxCrossEval, setMaxCrossEval] = useState(0); // Valor editable para Ev. Cruzada
  const [teams, setTeams] = useState([]); // Declaración e inicialización de 'teams'
  const [dataTable, setDataTable] = useState([]); // Datos de estudiantes y notas
  const [numSprints, setNumSprints] = useState(0); // Número de sprints dinámico

  // Obtener la lista de equipos al montar el componente
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/equipos');
        console.log("Equipos:", response.data.empresas); // Verificar los datos recibidos
        setTeams(response.data.empresas);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
        // Manejar el error si es necesario
      }
    };
    fetchTeams();
  }, []);

  // Obtener estudiantes y sus notas cuando se selecciona un equipo
  useEffect(() => {
    if (selectedTeam) {
      axios
        .get(`/estudiantes-con-notas/${selectedTeam}`)
        .then((response) => {
          console.log("Estudiantes y notas recibidos:", response.data); // Verificar los datos recibidos
          if (response.data && response.data.estudiantes) {
            setDataTable(response.data.estudiantes);
            setNumSprints(response.data.numSprints || 0); // Establecer el número de sprints dinámicamente, manejar caso undefined
          } else {
            setDataTable([]);
            setNumSprints(0);
          }
        })
        .catch((error) => {
          console.error("Error al obtener notas de estudiantes:", error);
          setDataTable([]); // Asegurarse de que dataTable sea un arreglo
          setNumSprints(0);
        });
    } else {
      setDataTable([]);
      setNumSprints(0);
    }
  }, [selectedTeam]);

  // Manejar cambios en la selección de equipo
  const handleTeamChange = (e) => setSelectedTeam(e.target.value);

  // Actualizar las notas finales en el backend
  const handleUpdateFinalGrades = () => {
    // Validar que los valores no excedan 100
    if (parseFloat(maxSprintScore) + parseFloat(maxCrossEval) > 100) {
      alert("La suma de Nota Sprint y Evaluación Cruzada no debe superar 100.");
      return;
    }

    axios
      .post(`/actualizar-notas-finales/${selectedTeam}`, {
        nota_valor_sprint: parseFloat(maxSprintScore),
        nota_valor_cruzada: parseFloat(maxCrossEval),
      })
      .then((response) => {
        alert(response.data.message);
        // Volver a obtener los datos actualizados
        axios.get(`/estudiantes-con-notas/${selectedTeam}`).then((response) => {
          if (response.data && response.data.estudiantes) {
            setDataTable(response.data.estudiantes);
            setNumSprints(response.data.numSprints || 0);
          } else {
            setDataTable([]);
            setNumSprints(0);
          }
        });
      })
      .catch((error) => {
        console.error("Error al actualizar notas finales:", error);
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert("Error al actualizar notas finales.");
        }
      });
  };

  return (
    <div className="container">
      <h1 className="title">Planilla de Notas Final</h1>
      <div className="filter">
        <div style={{ display: 'inline-block', width: '32%', marginBottom: '15px', marginRight: '1%', verticalAlign: 'top' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#333' }}>Equipo:</label>
          <select
            value={selectedTeam}
            onChange={handleTeamChange}
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
      </div>
      {selectedTeam && (
        <div className="inputs">
          <label>
            Nota Sprint (%):
            <input
              type="number"
              value={maxSprintScore}
              onChange={(e) => setMaxSprintScore(e.target.value)}
              min="0"
              max="100"
              style={{ marginLeft: '10px', marginRight: '20px' }}
            />
          </label>
          <label>
            Evaluación Cruzada (%):
            <input
              type="number"
              value={maxCrossEval}
              onChange={(e) => setMaxCrossEval(e.target.value)}
              min="0"
              max="100"
              style={{ marginLeft: '10px' }}
            />
          </label>
          <button onClick={handleUpdateFinalGrades} style={{ marginLeft: '20px', padding: '8px 16px' }}>
            Actualizar Notas Finales
          </button>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              {[...Array(numSprints)].map((_, index) => (
                <th key={index}>Sprint {index + 1}</th>
              ))}
              <th>Promedio Sprint</th>
              <th>Nota Cruzada</th>
              <th>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataTable) && dataTable.length > 0 ? (
              dataTable.map((row, index) => (
                <tr key={index}>
                  <td>
                    {row.nombre ? row.nombre : 'N/A'} {row.apellidos ? row.apellidos : 'N/A'}
                  </td>
                  {[...Array(numSprints)].map((_, sprintIndex) => {
                    const sprintNumber = sprintIndex + 1;
                    return (
                      <td key={sprintIndex}>
                        {row.sprints && row.sprints[`sprint${sprintNumber}`] !== undefined
                          ? row.sprints[`sprint${sprintNumber}`]
                          : 0}
                      </td>
                    );
                  })}
                  <td>{row.notaPromedioSprint !== undefined ? row.notaPromedioSprint.toFixed(2) : '0.00'}</td>
                  <td>{row.notaCruzada !== undefined ? row.notaCruzada : '0'}</td>

                  <td>{row.notaFin !== undefined ? row.notaFin.toFixed(2) : '0.00'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={(5 + numSprints) || '5'}>No hay datos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalGradeTable;
