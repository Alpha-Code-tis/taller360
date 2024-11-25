import React, { useState } from "react";
import "./PlanillaNotas.css";

const EvaluationTables = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSprint, setSelectedSprint] = useState("");

  // Datos de ejemplo
  const dataTable1 = [
    { team: "Alpha code", name: "María Johnson", eval: 7, crossEval: 4, selfEval: 4, finalGrade: 15 },
    { team: "Alpha code", name: "María Vargas", eval: 8, crossEval: 3, selfEval: 5, finalGrade: 16 },
    { team: "Code Soft", name: "Laura Brown", eval: 7, crossEval: 5, selfEval: 5, finalGrade: 17 },
    { team: "Code Soft", name: "James Smith", eval: 9, crossEval: 4, selfEval: 4, finalGrade: 17 },
    { team: "Code Soft", name: "Sarah Miller", eval: 5, crossEval: 5, selfEval: 5, finalGrade: 15 },
  ];

  const dataTable2 = [
    { team: "Alpha code", name: "María Johnson", sprint1: 20, sprint2: 88, sprint3: 88, sprint4: 88, peerEval: 88, finalGrade: 80 },
    { team: "Alpha code", name: "María Vargas", sprint1: 17, sprint2: 30, sprint3: 76, sprint4: 76, peerEval: 76, finalGrade: 76 },
    { team: "Code Soft", name: "Laura Brown", sprint1: 70, sprint2: 10, sprint3: 50, sprint4: 50, peerEval: 50, finalGrade: 50 },
    { team: "Code Soft", name: "James Smith", sprint1: 65, sprint2: 30, sprint3: 30, sprint4: 30, peerEval: 30, finalGrade: 30 },
    { team: "Code Soft", name: "Sarah Miller", sprint1: 65, sprint2: 65, sprint3: 65, sprint4: 65, peerEval: 65, finalGrade: 65 },
  ];

  // Filtrar datos según selección
  const filteredTable1 = dataTable1.filter(
    (row) => selectedTeam === "" || row.team === selectedTeam
  );

  const filteredTable2 = dataTable2.filter(
    (row) => selectedTeam === "" || row.team === selectedTeam
  );

  // Manejadores de eventos
  const handleTeamChange = (e) => setSelectedTeam(e.target.value);
  const handleSprintChange = (e) => setSelectedSprint(e.target.value);

  return (
    <div className="table-container">
      {/* Título principal */}
      <h1 className="main-title">Planilla de Notas</h1>

      {/* Filtros */}
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
            <option value="Sprint 1">Sprint 1</option>
            <option value="Sprint 2">Sprint 2</option>
          </select>
        </label>
      </div>

      <h3 className="table-title">Evaluación por Equipo</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Evaluación / 10</th>
            <th>Ev. Cruzada / 5</th>
            <th>Autoevaluación / 5</th>
            <th>Nota Final / 20</th>
          </tr>
        </thead>
        <tbody>
          {filteredTable1.map((row, index) => (
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

      <h3 className="table-title">Evaluación por Sprint</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Sprint 1</th>
            <th>Sprint 2</th>
            <th>Sprint 3</th>
            <th>Sprint 4</th>
            <th>Evaluación Pares</th>
            <th>Nota Final / 100</th>
          </tr>
        </thead>
        <tbody>
          {filteredTable2.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.sprint1}</td>
              <td>{row.sprint2}</td>
              <td>{row.sprint3}</td>
              <td>{row.sprint4}</td>
              <td>{row.peerEval}</td>
              <td>{row.finalGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EvaluationTables;
