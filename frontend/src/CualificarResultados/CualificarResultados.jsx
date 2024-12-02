import { API_URL } from '../config';   
import React, { useEffect } from 'react';
import { useState } from 'react';
import './CualificarResultados.css';
import axios from 'axios';

const CualificarResultados = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
      axios.get(`${API_URL}cualificacion`)  
        .then((response) => {
         
          setStudents(response.data); 
        })
        .catch((error) => {
          console.log(error);
          console.error('Error al obtener los datos:', error);
        });
    }, []); 


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
              <td>{student.nombre}</td>
              <td>{student.nota}</td>
              <td>{student.clasificacion} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CualificarResultados;