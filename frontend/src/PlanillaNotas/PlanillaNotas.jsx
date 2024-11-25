import React, { useState } from "react";
import "./PlanillaNotas.css";

const EvaluationTables = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");

  const dataTable = [
    {
      team: "Alpha code",
      name: "María Johnson",
      eval: 7,
      crossEval: 4,
      selfEval: 4,
      sprint: 20,
      peerEval: 88,
      finalGrade: 80,
    },
    {
      team: "Alpha code",
      name: "María Vargas",
      eval: 8,
      crossEval: 3,
      selfEval: 5,
      sprint: 17,
      peerEval: 76,
      finalGrade: 76,
    },
    {
      team: "Code Soft",
      name: "Laura Brown",
      eval: 7,
      crossEval: 5,
      selfEval: 5,
      sprint: 70,
      peerEval: 50,
      finalGrade: 50,
    },
    {
      team: "Code Soft",
      name: "James Smith",
      eval: 9,
      crossEval: 4,
      selfEval: 4,
      sprint: 65,
      peerEval: 30,
      finalGrade: 30,
    },
  ];

  const filteredData = dataTable.filter(
    (row) =>
      (selectedTeam === "" || row.team === selectedTeam) &&
      (selectedSprint === "" || row.sprint === Number(selectedSprint))
  );

  const handleTeamChange = (e) => setSelectedTeam(e.target.value);
  const handleSprintChange = (e) => setSelectedSprint(e.target.value);

  return (
    <div className="page-container">
      <h1 className="main-title">Planilla de Notas</h1>
      <div className="filters">
        <label>
          Equipo:
          <select value={selectedTeam} onChange={handleTeamChange}>
            <option value="">Todos</option>
            <option value="Alpha code">Alpha code</option>
            <option value="Code Soft">Code Soft</option>
          </select>
        </label>
        <label>
          Sprint:
          <select value={selectedSprint} onChange={handleSprintChange}>
            <option value="">Todos</option>
            <option value="20">1</option>
            <option value="17">2</option>
            <option value="70">3</option>
            <option value="65">4</option>
          </select>
        </label>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Evaluación</th>
              <th>Ev. Cruzada</th>
              <th>Autoevaluación</th>
              <th>Sprint</th>
              <th>Evaluación Pares</th>
              <th>Nota Final</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.eval}</td>
                <td>{row.crossEval}</td>
                <td>{row.selfEval}</td>
                <td>{row.sprint}</td>
                <td>{row.peerEval}</td>
                <td>{row.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EvaluationTables;
