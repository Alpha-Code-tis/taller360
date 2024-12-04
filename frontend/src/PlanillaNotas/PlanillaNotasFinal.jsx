import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PlanillaNotasFinal.css";
import { API_URL } from '../config';

const FinalGradeTable = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [maxSprintScore, setMaxSprintScore] = useState(0);
  const [maxCrossEval, setMaxCrossEval] = useState(0);
  const [teams, setTeams] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [numSprints, setNumSprints] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${API_URL}equipos-planilla`);
        setTeams(response.data.empresas || []);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
        setErrorMessage("Error al obtener equipos.");
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      axios
        .get(`${API_URL}estudiantes-con-notas/${selectedTeam}`, {
          params: {
            nota_valor_sprint: maxSprintScore,
            nota_valor_cruzada: maxCrossEval,
          },
        })
        .then((response) => {
          setDataTable(response.data.estudiantes || []);
          setNumSprints(response.data.numSprints || 0);
        })
        .catch((error) => {
          console.error("Error al obtener notas de estudiantes:", error);
          setErrorMessage("Error al obtener notas de estudiantes.");
          setDataTable([]);
          setNumSprints(0);
        });
    } else {
      setDataTable([]);
      setNumSprints(0);
    }
  }, [selectedTeam, maxSprintScore, maxCrossEval]);

  const handleTeamChange = (e) => setSelectedTeam(e.target.value);

  const handleUpdateFinalGrades = () => {
    if (parseFloat(maxSprintScore) + parseFloat(maxCrossEval) > 100) {
      setErrorMessage("La suma de Nota Sprint y Evaluación Cruzada no debe superar 100.");
      setSuccessMessage("");
      return;
    }

    axios
      .post(`${API_URL}actualizar-notas-finales/${selectedTeam}`, {
        nota_valor_sprint: parseFloat(maxSprintScore),
        nota_valor_cruzada: parseFloat(maxCrossEval),
      })
      .then((response) => {
        setSuccessMessage(response.data.message);
        axios.get(`${API_URL}estudiantes-con-notas/${selectedTeam}`).then((response) => {
          setDataTable(response.data.estudiantes || []);
          setNumSprints(response.data.numSprints || 0);
        });
      })
      .catch((error) => {
        console.error("Error al actualizar notas finales:", error);
        setErrorMessage("Error al actualizar notas finales.");
      });
  };

  return (
    <div className="container">
      <h1 className="title">Planilla de Notas Final</h1>

      <div className="filter">
        <label>Equipo:</label>
        <select value={selectedTeam} onChange={handleTeamChange}>
          <option value="">Seleccionar equipo</option>
          {teams.map((team) => (
            <option key={team.id_empresa} value={team.id_empresa}>
              {team.nombre_empresa}
            </option>
          ))}
        </select>
      </div>

      <div className="inputs">
        <label>Nota Sprint (%):</label>
        <input
          type="number"
          value={maxSprintScore}
          onChange={(e) => setMaxSprintScore(e.target.value)}
          min="0"
          max="100"
        />
        <label>Evaluación Cruzada (%):</label>
        <input
          type="number"
          value={maxCrossEval}
          onChange={(e) => setMaxCrossEval(e.target.value)}
          min="0"
          max="100"
        />

      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              {[...Array(numSprints)].map((_, index) => (
                <th key={index}>Sprint {index + 1}</th>
              ))}
              <th>Nota Total Sprint</th>
              <th>Nota Cruzada</th>
              <th>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((row, index) => (
              <tr key={index}>
                <td>
                  {row.nombre} {row.apellidos}
                </td>
                {[...Array(numSprints)].map((_, sprintIndex) => (
                  <td key={sprintIndex}>
                    {row.sprints[`sprint${sprintIndex + 1}`] || 0}
                  </td>
                ))}
                <td>{row.notaTotalSprint}</td>
                <td>{row.notaCruzada}</td>
                <td>{row.notaFin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalGradeTable;
