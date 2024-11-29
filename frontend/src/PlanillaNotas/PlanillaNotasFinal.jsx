import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlanillaNotasFinal.css";

// **Configurar la URL base para Axios**
axios.defaults.baseURL = 'http://localhost:8000/api';

const FinalGradeTable = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [maxSprintScore, setMaxSprintScore] = useState(0); // Valor editable para Nota Sprint
  const [maxCrossEval, setMaxCrossEval] = useState(0); // Valor editable para Ev. Cruzada
  const [teams, setTeams] = useState([]); // **Declaración e inicialización de 'teams'**
  const [dataTable, setDataTable] = useState([]); // Datos de estudiantes y notas

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
          console.log("Estudiantes y notas:", response.data); // Verificar los datos recibidos
          setDataTable(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener notas de estudiantes:", error);
          setDataTable([]); // Asegurarse de que dataTable sea un arreglo
        });
    } else {
      setDataTable([]);
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
        axios
          .get(`/estudiantes-con-notas/${selectedTeam}`)
          .then((response) => {
            setDataTable(response.data);
          })
          .catch((error) => {
            console.error("Error al obtener notas de estudiantes:", error);
            setDataTable([]); // Asegurarse de que dataTable sea un arreglo
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
          <select value={selectedTeam} onChange={handleTeamChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000' }}>
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
            Nota Sprint:
            <input
              type="number"
              value={maxSprintScore}
              onChange={(e) => setMaxSprintScore(e.target.value)}
            />
          </label>
          <label>
            Ev. Cruzada:
            <input
              type="number"
              value={maxCrossEval}
              onChange={(e) => setMaxCrossEval(e.target.value)}
            />
          </label>
          <button onClick={handleUpdateFinalGrades}>
            Actualizar Notas Finales
          </button>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nota Total Sprint</th>
              <th>Nota Cruzada</th>
              <th>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dataTable) ? (
              dataTable.map((row, index) => (
                <tr key={index}>
                  <td>
                    {row.nombre} {row.apellidos}
                  </td>
                  <td>{row.notaTotalSprint}</td>
                  <td>{row.notaCruzada}</td>
                  <td>{row.notaFin}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay datos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalGradeTable;
