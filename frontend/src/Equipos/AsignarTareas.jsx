import React, { useState } from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import './AsignarTareas.css'; // Importa el CSS para el estilo.

const AsignarTareas = () => {
  // Estado para almacenar tareas y responsables
  const [tareas, setTareas] = useState([
    { id: 1, nombre: 'Revisar documentos', responsables: [] },
    { id: 2, nombre: 'Preparar presentación', responsables: [] },
  ]);

  const miembros = [
    { value: '1', label: 'Juan Pérez' },
    { value: '2', label: 'Ana Gómez' },
    { value: '3', label: 'Luis Martínez' },
  ];

  // Manejador para asignar responsables a una tarea
  const handleAsignarResponsables = (selectedOptions, tareaId) => {
    const nuevasTareas = tareas.map((tarea) =>
      tarea.id === tareaId
        ? { ...tarea, responsables: selectedOptions || [] }
        : tarea
    );
    setTareas(nuevasTareas);
  };

  // Manejador para eliminar un responsable
  const handleEliminarResponsable = (tareaId, responsableId) => {
    const nuevasTareas = tareas.map((tarea) =>
      tarea.id === tareaId
        ? {
            ...tarea,
            responsables: tarea.responsables.filter(
              (responsable) => responsable.value !== responsableId
            ),
          }
        : tarea
    );
    setTareas(nuevasTareas);
  };

  return (
    <div className="asignar-tareas-container">
      <h2>Asignar Tareas a los Miembros del Equipo</h2>
      <table className="tareas-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsables</th>
            <th>Asignar Responsables</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id}>
              <td>{tarea.nombre}</td>
              <td>
                {tarea.responsables.map((responsable) => (
                  <div key={responsable.value} className="responsable">
                    {responsable.label}
                    <FaTimes
                      className="eliminar-icon"
                      onClick={() =>
                        handleEliminarResponsable(tarea.id, responsable.value)
                      }
                    />
                  </div>
                ))}
              </td>
              <td>
                <Select
                  isMulti
                  options={miembros}
                  value={tarea.responsables}
                  onChange={(selectedOptions) =>
                    handleAsignarResponsables(selectedOptions, tarea.id)
                  }
                  placeholder="Seleccionar miembros"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsignarTareas;
