import React, { useState } from 'react';
import './Autoevaluacion.css';

const Autoevaluacion = () => {
  const [showEvaluation, setShowEvaluation] = useState(null);

  // Función para manejar el botón de evaluar
  const handleEvaluateClick = (task) => {
    setShowEvaluation((prev) => (prev === task ? null : task));
  };

  // const fetchTareas = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8000/api/estudiantes');
  //     setEstudiantes(response.data);
  //     setFilteredEstudiantes(response.data);

  //     // Si no hay estudiantes, mostrar mensaje de error
  //     if (response.data.length === 0) {
  //       toast.error('No hay estudiantes registrados.');
  //     }
  //   } catch (err) {
  //     // Muestra el error si hay un problema en la petición
  //     toast.error('Error al cargar los estudiantes.');
  //   }
  // };
  // useEffect(() => {
  //   fetchTareas();
  // }, []);

    // Opciones de evaluación con colores
  const evaluationOptions = [
    { value: 1, label: 'Malo', color: '#a9cce3' }, //
    { value: 2, label: 'Regular', color: '#a9cce3' }, //
    { value: 3, label: 'Aceptable', color: '#a9cce3' }, //
    { value: 4, label: 'Bueno', color: '#a9cce3' }, //
    { value: 5, label: 'Excelente', color: '#a9cce3' } //
  ];

  return (
    <div className="autoevaluacion-container">
      <h1 className="title">Autoevaluación de las tareas completadas</h1>
      <div className="task-list">
        {[
          { name: 'Registrar docentes', date: '10 al 17 de octubre' },
          { name: 'Registrar estudiante', date: '10 al 17 de octubre' },
          { name: 'Registrar planificación', date: '10 al 17 de octubre' },
        ].map((task, index) => (
          <div key={index} className="task-item">
            <div className="row">
              <div className="col vertical-center">
                <span>{task.name}</span>
              </div>
              <div className="col">
              <button className="btn btn-primary btn-sm" type="button"
                onClick={() => handleEvaluateClick(task.name)}>
                Evaluar
              </button>
              </div>
              <div className="col vertical-center">
                <span>{task.date}</span>
              </div>
            </div>
              {showEvaluation === task.name && (
                <div className="evaluation-options">
                  {evaluationOptions.map((option) => (
                    <div key={option.value} className="evaluation-item">
                        <button className="evaluation-circle"
                          style={{ backgroundColor: option.color }}>
                          {option.value}
                        </button>
                        <span className="evaluation-label">{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Autoevaluacion;
