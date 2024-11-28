import React, { useState } from "react";
import "./PlanillaNotasFinal.css";

const FinalGradeTable = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [maxSprintScore, setMaxSprintScore] = useState( ); // Valor editable para Nota Sprint
  const [maxCrossEval, setMaxCrossEval] = useState(); // Valor editable para Ev. Cruzada

  const dataTable = [
    {
      name: "Maria Johnson",
      sprint1: 20,
      sprint2: 88,
      sprint3: 88,
      sprint4: 88,
      sprintGrade: 88,
      crossEval: 88,
      finalGrade: 80,
      team: "Alpha code",
    },
    {
      name: "Maria Vargas",
      sprint1: 17,
      sprint2: 30,
      sprint3: 76,
      sprint4: 76,
      sprintGrade: 76,
      crossEval: 88,
      finalGrade: 76,
      team: "Alpha code",
    },
    {
      name: "Laura Brown",
      sprint1: 70,
      sprint2: 10,
      sprint3: 50,
      sprint4: 50,
      sprintGrade: 50,
      crossEval: 88,
      finalGrade: 50,
      team: "Code Soft",
    },
    {
      name: "James Smith",
      sprint1: 65,
      sprint2: 30,
      sprint3: 30,
      sprint4: 30,
      sprintGrade: 30,
      crossEval: 88,
      finalGrade: 30,
      team: "Code Soft",
    },
    {
      name: "Sarah Miller",
      sprint1: 65,
      sprint2: 65,
      sprint3: 65,
      sprint4: 65,
      sprintGrade: 65,
      crossEval: 88,
      finalGrade: 65,
      team: "Code Soft",
    },
  ];

  const filteredData = dataTable.filter(
    (row) => selectedTeam === "" || row.team === selectedTeam
  );

  const handleTeamChange = (e) => setSelectedTeam(e.target.value);

  return (
    <div className="container">
      <h1 className="title">Planilla de Notas Final</h1>
      <div className="filter">
        <label>
          Equipos:
          <select value={selectedTeam} onChange={handleTeamChange}>
            <option value="">Seleccionar equipo</option>
            <option value="Alpha code">Alpha code</option>
            <option value="Code Soft">Code Soft</option>
          </select>
        </label>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Sprint 1</th>
              <th>Sprint 2</th>
              <th>Sprint 3</th>
              <th>Sprint 4</th>
              <th>
                Nota Sprint /{" "}
                <input
                  type="number"
                  value={maxSprintScore}
                  onChange={(e) => setMaxSprintScore(e.target.value)}
                  className="input-header"
                />
              </th>
              <th>
                Ev. Cruzada /{" "}
                <input
                  type="number"
                  value={maxCrossEval}
                  onChange={(e) => setMaxCrossEval(e.target.value)}
                  className="input-header"
                />
              </th>
              <th>Nota Final / 100</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.sprint1}</td>
                <td>{row.sprint2}</td>
                <td>{row.sprint3}</td>
                <td>{row.sprint4}</td>
                <td>{row.sprintGrade}</td>
                <td>{row.crossEval}</td>
                <td>{row.finalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinalGradeTable;
