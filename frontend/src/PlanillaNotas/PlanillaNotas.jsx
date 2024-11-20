import React from 'react';
import './PlanillaNotas.css';

const PlanillaNotas = () => {
  const students = [
    { name: 'Maria Johnson', selfEval: 85, crossEval: 88, peerEval: 88, finalGrade: 88 },
    { name: 'Maria Vargas', selfEval: 50, crossEval: 30, peerEval: 76, finalGrade: 76 },
    { name: 'Laura Brown', selfEval: 70, crossEval: 10, peerEval: 50, finalGrade: 50 },
    { name: 'James Smith', selfEval: 65, crossEval: 30, peerEval: 30, finalGrade: 30 },
    { name: 'Sarah Miller', selfEval: 65, crossEval: 65, peerEval: 65, finalGrade: 65 },
  ];

  return (
    <div className="planilla-notas-container">
      <h2>Planilla de Notas</h2>
      <table className="planilla-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Autoevaluación</th>
            <th>Ev. Cruzada</th>
            <th>Ev. Pares</th>
            <th>Nota Final</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.selfEval}</td>
              <td>{student.crossEval}</td>
              <td>{student.peerEval}</td>
              <td>{student.finalGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanillaNotas;
