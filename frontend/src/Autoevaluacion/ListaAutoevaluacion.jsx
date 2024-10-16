import React from 'react';
import './ListaAutoevaluacion.css';

const ListaAutoevaluacion = ({ estudiantes }) => {
  return (
    <div className="lista-autoevaluacion-container">
      <h1 className="title">Lista de Autoevaluaciones</h1>
      <table className="autoevaluacion-table">
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Nota de Autoevaluación</th>
            <th>Tareas Realizadas</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante, index) => (
            <tr key={index}>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.nota}</td>
              <td>
                <ul>
                  {estudiante.tareas.map((tarea, idx) => (
                    <li key={idx}>{tarea}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaAutoevaluacion;
