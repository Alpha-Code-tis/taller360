import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './ListaAutoevaluacion.css';

const ListaAutoevaluacion = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  // Fetching estudiantes from the backend
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/estudiantes');
      console.log('esd', response.data);
      setEstudiantes(response.data);
      // setFilteredEstudiantes(response.data);

      // Si no hay estudiantes, mostrar mensaje de error
      if (response.data.length === 0) {
        toast.error('No hay estudiantes registrados.');
      }
    } catch (err) {
      // Muestra el error si hay un problema en la petición
      toast.error('Error al cargar los estudiantes.');
    }
  };


  useEffect(() => {
    fetchEstudiantes();
  }, []);

  const tareas = [
    { name: 'Registrar docentes', date: '10 al 17 de octubre' },
    { name: 'Registrar estudiante', date: '10 al 17 de octubre' },
    { name: 'Registrar planificación', date: '10 al 17 de octubre' },
  ];

  return (
    <div className="lista-autoevaluacion-container">
      <h1 className="title">Lista de Autoevaluaciones</h1>
      <table className="autoevaluacion-table">
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            {/* <th>Nota de Autoevaluación</th> */}
            <th>Tareas Realizadas</th>
            <th>Estado de las tareas</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante, index) => (
            <tr key={index}>
              <td>{`${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`}</td>
              <td>
                <ul>
                  {tareas.map((tarea, idx) => (
                    <li key={idx}>{tarea.name }</li>
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
