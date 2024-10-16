import React, { useState } from 'react';
import Select from 'react-select';
import './Seguimiento.css';

const Seguimiento = () => {
  const [tasks, setTasks] = useState([
    { tarea: 'Registrar docente', responsables: [], estado: 'En progreso', progreso: '40%' },
    { tarea: 'Visualizar planilla', responsables: [], estado: 'En progreso', progreso: '20%' },
    { tarea: 'Registrar equipo', responsables: [], estado: 'Pendiente', progreso: '0%' },
    { tarea: 'Autentificar usuarios', responsables: [], estado: 'Terminado', progreso: '100%' },
    { tarea: 'Registrar estudiantes', responsables: [], estado: 'Pendiente', progreso: '80%' },
  ]);

  const options = [
    { value: 'Juan Carlos Ortiz Ugarte', label: 'Juan Carlos Ortiz Ugarte' },
    { value: 'Felipe Garcia Molina', label: 'Felipe Garcia Molina' },
    { value: 'Enrique Gomez Perez', label: 'Enrique Gomez Perez' },
    { value: 'Andrea Escalera Claros', label: 'Andrea Escalera Claros' },
    { value: 'Federico Valverde Torres', label: 'Federico Valverde Torres' }
  ];

  // Manejar la selección de responsables
  const handleResponsableChange = (selectedOptions, taskIndex) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].responsables = selectedOptions || [];
    setTasks(newTasks);
  };

  // Manejar la eliminación de un responsable
  const handleRemoveResponsable = (taskIndex, responsableToRemove) => {
    const newTasks = [...tasks];
    newTasks[taskIndex].responsables = newTasks[taskIndex].responsables.filter(responsable => responsable.value !== responsableToRemove.value);
    setTasks(newTasks);
  };

  return (
    <div className="planilla-seguimiento">
      <header>
        <h1>Planilla de seguimiento</h1>
      </header>

      <div className="sprint-selector">
        <label>Sprint</label>
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Progreso</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.tarea}</td>
              <td>
                <Select
                  isMulti
                  options={options}
                  value={task.responsables}
                  onChange={(selectedOptions) => handleResponsableChange(selectedOptions, index)}
                  className="responsable-select"
                  placeholder="Selecciona responsables"
                />
              </td>
              <td>{task.estado}</td>
              <td>{task.progreso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Seguimiento;
