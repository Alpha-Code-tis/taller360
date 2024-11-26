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
      sprint: 1,
      finalGrade: 15,
    },
    {
      team: "Alpha code",
      name: "María Vargas",
      eval: 8,
      crossEval: 3,
      selfEval: 5,
      sprint: 1,
      finalGrade: 16,
    },
    {
      team: "Code Soft",
      name: "Laura Brown",
      eval: 7,
      crossEval: 5,
      selfEval: 5,
      sprint: 2,
      finalGrade: 17,
    },
    {
      team: "Code Soft",
      name: "James Smith",
      eval: 9,
      crossEval: 4,
      selfEval: 4,
      sprint: 2,
      finalGrade: 17,
    },
    {
      team: "Code Soft",
      name: "Sarah Miller",
      eval: 5,
      crossEval: 5,
      selfEval: 5,
      sprint: 2,
      finalGrade: 15,
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
      <h1 className="main-title">Planilla de Notas Sprints</h1>
      <div className="filters">
        <label>
          Equipos:
          <select value={selectedTeam} onChange={handleTeamChange}>
            <option value="">Seleccionar equipo</option>
            <option value="Alpha code">Alpha code</option>
            <option value="Code Soft">Code Soft</option>
          </select>
        </label>
        <label>
          Sprint:
          <select value={selectedSprint} onChange={handleSprintChange}>
            <option value="">Seleccionar sprint</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </label>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Evaluación / 10</th>
              <th>Ev.Pares/ 5</th>
              <th>Autoevaluación / 5</th>
              <th>Nota Final / 20</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.eval}</td>
                <td>{row.crossEval}</td>
                <td>{row.selfEval}</td>
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
