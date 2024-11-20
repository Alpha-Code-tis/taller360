import React from 'react';
import './CualificarResultados.css';
import { useState } from 'react';
const CualificarResultados = () => {
    const [categorias, setCategorias] = useState([]);
  const students = [
    { name: 'Maria Johnson', selfEval: 85 , des: 'Fuerte'},
    { name: 'Maria Vargas', selfEval: 50, des: 'Fuerte'},
    { name: 'Laura Brown', selfEval: 70, des: 'Debil'},
    { name: 'James Smith', selfEval: 65, des: 'Fuerte'},
    { name: 'Sarah Miller', selfEval: 65,des: 'Fuerte'},
    { name: 'Luis Salvatierra', selfEval: 50, des: 'Fuerte'},
    { name: 'Gonzalo Brown', selfEval: 70, des: 'Fuerte'},
    { name: 'Juan Smith', selfEval: 65,des: 'Fuerte'},
    { name: 'Sofia Miller', selfEval: 65,des: 'Fuerte'},
  ];
  return (
    <div className="cualificar-container">
      <h2>Cualificar Resultados</h2>
      <table className="planilla-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntaje de Evaluación</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td>{student.selfEval}</td>
              <td>{student.des} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CualificarResultados;