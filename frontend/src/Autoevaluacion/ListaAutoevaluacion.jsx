import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import './ListaAutoevaluacion.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');

const ListaAutoevaluacion = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  // Fetching estudiantes from the backend
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(`${API_URL}autoevaluacion/estudiantes-tareas`);
      setEstudiantes(response.data);

      // Si no hay estudiantes, mostrar mensaje de error
      if (response.data.length === 0) {
        toast.error('No hay estudiantes.');
      }
    } catch (err) {
      // Muestra el error si hay un problema en la petición
      toast.error('Error al cargar los estudiantes y sus tareas.');
    }
  };


  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return (
    <div className="lista-autoevaluacion-container">
      <h1 className="title">Lista de Autoevaluaciones</h1>
      <table className="autoevaluacion-table">
        <thead>
          <tr>
            <th>Nombre del Estudiante</th>
            <th>Tareas Realizadas</th>
            <th>Estado de las tareas</th>
            <th>Detalles de la autoevaluacion</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante, index) => (
            <tr key={index}>
              <td>{`${estudiante.ap_pat} ${estudiante.ap_mat} ${estudiante.nombre_estudiante}`}</td>
              <td>
                <ul>
                  {estudiante.tareas.map((tarea, idx) => (
                    <li key={idx}>{tarea.nombre_tarea}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {estudiante.tareas.map((tarea, idx) => (
                    <li key={idx}>{tarea.estado}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {estudiante.tareas.map((tarea, idx) => (
                    <li key={idx}>{tarea.pivot.resultado_evaluacion} { tarea.pivot.descripcion_evaluacion ? ' - ' + tarea.pivot.descripcion_evaluacion : '' }</li>
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
