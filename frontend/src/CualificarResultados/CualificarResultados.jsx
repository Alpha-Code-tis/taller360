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
    <div>
      <div className="justify-content-between align-items-center mb-3">
        <h1 className='m-0'>Cualificar Resultados</h1>
      </div>
      <div className="cualificar-container">
        <table className="table table-hover cualificar-table">
          <thead className="table-light">
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
    </div>
  );
};
export default CualificarResultados;