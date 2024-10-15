import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GenerarPlanilla.css';

function GenerarPlanilla() {
  // Estados para la planilla
  const [sprint, setSprint] = useState(1);
  const [equipo, setEquipo] = useState('Alpha code');
  const [tareas, setTareas] = useState([
    { id: 1, tarea: 'Registrar docente', responsable: 'Juan Carlos Ortiz Ugarte', estado: 'En progreso', progreso: 40, imagenes: ['img1.jpg', 'img2.jpg'] },
    { id: 2, tarea: 'Visualizar planilla', responsable: 'Felipe Garcia Molina', estado: 'En progreso', progreso: 20, imagenes: ['img3.jpg'] },
    { id: 3, tarea: 'Registrar equipo', responsable: 'Enrique Gomez Perez', estado: 'Pendiente', progreso: 0, imagenes: [] },
    { id: 4, tarea: 'Autentificar usuarios', responsable: 'Maria Cristina Aguilar Reyes', estado: 'Terminado', progreso: 100, imagenes: ['img6.jpg', 'img4.jpg', 'img5.jpg'] },
    { id: 5, tarea: 'Registrar estudiantes', responsable: 'Andres Gomez Perez', estado: 'Pendiente', progreso: 0, imagenes: [] }
  ]);

  // Estados para el modal
  const [imagenes, setImagenes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función para manejar el clic en el ojito
  const verImagenes = (idTarea) => {
    const tareaSeleccionada = tareas.find(tarea => tarea.id === idTarea);
    setImagenes(tareaSeleccionada?.imagenes || []);
    setMostrarModal(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setImagenes([]);
  };

  return (
    <div className="generar-planilla">
      <h2>Planilla Semanal</h2>
      <div className="filters">
        <div className="filter">
          <label>Sprint</label>
          <select value={sprint} onChange={(e) => setSprint(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="filter">
          <label>Equipos</label>
          <select value={equipo} onChange={(e) => setEquipo(e.target.value)}>
            <option value="Alpha code">Alpha code</option>
            <option value="Code Soft">Code Soft</option>
          </select>
        </div>
      </div>
      <table className="planilla-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Progreso</th>
            <th>Vista</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((item, index) => (
            <tr key={item.id}>
              <td>{item.tarea}</td>
              <td>{item.responsable}</td>
              <td>{item.estado}</td>
              <td>
                <select value={item.progreso} onChange={(e) => {
                  const updatedTareas = [...tareas];
                  updatedTareas[index].progreso = parseInt(e.target.value);
                  setTareas(updatedTareas);
                }}>
                  <option value="0">0 %</option>
                  <option value="20">20 %</option>
                  <option value="40">40 %</option>
                  <option value="60">60 %</option>
                  <option value="80">80 %</option>
                  <option value="100">100 %</option>
                </select>
              </td>
              <td>
                <button className="view-button" onClick={() => verImagenes(item.id)}>👁️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para mostrar las imágenes */}
      {mostrarModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={cerrarModal}>&times;</span>
            <h3>Imágenes de la Tarea</h3>
            <div className="imagenes-grid">
              {imagenes.length > 0 ? (
                imagenes.map((img, index) => (
                  <img key={index} src={img} alt={`Imagen ${index + 1}`} />
                ))
              ) : (
                <p>No hay imágenes disponibles para esta tarea.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerarPlanilla;
