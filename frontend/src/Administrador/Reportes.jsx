// src/components/Reportes.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './reportes.css'; // Importar estilos

const API_URL = 'http://localhost:8000/api';

const Reportes = () => {
  const [gestion, setGestion] = useState('2-2024');
  const [gestiones, setGestiones] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [reporteData, setReporteData] = useState(null);

  // Nuevos estados para estudiantes
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchGestiones();
    fetchStudents(); // Obtener estudiantes al montar el componente
  }, []);

  useEffect(() => {
    if (gestion) {
      fetchEquipos();
    }
  }, [gestion]);

  const fetchGestiones = async () => {
    try {
      const response = await axios.get(`${API_URL}/gestiones`);
      setGestiones(response.data);
    } catch (error) {
      console.error('Error al obtener las gestiones:', error);
    }
  };

  const fetchEquipos = async () => {
    try {
      const response = await axios.get(`${API_URL}/equipos?gestion=${gestion}`);
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al obtener los equipos:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/estudiantes`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    }
  };

  const handleGestionChange = (e) => {
    setGestion(e.target.value);
    setSelectedEquipo(null);
    setReporteData(null);
  };

  const handleEquipoChange = async (option) => {
    setSelectedEquipo(option);

    if (option) {
      await fetchReporteData(option.value);
    } else {
      setReporteData(null);
    }
  };

  const fetchReporteData = async (id_empresa) => {
    try {
      const response = await axios.get(`${API_URL}/empresa/${id_empresa}/reporte`, {
        params: {
          gestion,
        },
      });
      setReporteData(response.data.empresa);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text('Reporte de Equipo', 105, y, { align: 'center' });
    y += 10;

    if (reporteData) {
      // Logo y datos de la empresa
      if (reporteData.logo) {
        doc.addImage(
          reporteData.logo.startsWith('http') ? reporteData.logo : `http://localhost:8000/storage/${reporteData.logo}`,
          'JPEG',
          10,
          y,
          30,
          30
        );
      }

      doc.setFontSize(12);
      doc.text(`Nombre del Equipo: ${reporteData.nombre_empresa}`, 50, y + 5);
      doc.text(`Nombre Corto: ${reporteData.nombre_corto}`, 50, y + 15);
      doc.text(`Teléfono: ${reporteData.telefono}`, 50, y + 25);
      doc.text(`Correo Electrónico: ${reporteData.correo_empresa}`, 50, y + 35);
      y += 40;

      if (reporteData.estudiantesSeleccionados.length > 0) {
        doc.text('Estudiantes:', 10, y);
        y += 10;
        reporteData.estudiantesSeleccionados.forEach((estudiante) => {
          doc.text(`- ${estudiante.nombre}`, 15, y);
          y += 10;
        });
      }

      // Planificaciones
      reporteData.planificaciones.forEach((planificacion) => {
        doc.text('Planificación:', 10, y);
        y += 10;
        planificacion.sprints.forEach((sprint) => {
          const fechaInicio = sprint.fecha_inicio.split('T')[0];
          const fechaFin = sprint.fecha_fin.split('T')[0];

          doc.text(`Sprint ${sprint.nro_sprint} (Inicio: ${fechaInicio}, Fin: ${fechaFin})`, 15, y);
          y += 10;

          sprint.alcances.forEach((alcance) => {
            doc.text(`  Alcance: ${alcance.descripcion}`, 20, y);
            y += 10;

            alcance.tareas.forEach((tarea) => {
              doc.text(`    Tarea: ${tarea.nombre_tarea} (Estimación: ${tarea.estimacion})`, 25, y);
              y += 10;
            });
          });
        });
      });

      // Evaluaciones Cruzadas
      if (reporteData.evaluacionesCruzadas.length > 0) {
        doc.text('Evaluaciones Cruzadas:', 10, y);
        y += 10;
        reporteData.evaluacionesCruzadas.forEach((evalCruzada) => {
          doc.text(`  Evaluador: ${evalCruzada.evaluator}`, 15, y);
          y += 10;

          if (evalCruzada.detalle_notas) {
            evalCruzada.detalle_notas.forEach((detalle) => {
              doc.text(`    ${detalle.criterio_nombre}: ${detalle.nota}`, 20, y);
              y += 10;
            });
          }
        });
      }
    }

    doc.save(`Reporte_Equipo_${reporteData?.nombre_corto || 'Sin_Nombre'}.pdf`);
  };

  // Nuevas funciones y manejadores para estudiantes

  const handleStudentChange = async (option) => {
    setSelectedStudent(option);

    if (option) {
      await fetchStudentData(option.value);
    } else {
      setStudentData(null);
    }
  };

  const fetchStudentData = async (id_estudiante) => {
    try {
      const response = await axios.get(`${API_URL}/estudiante/${id_estudiante}/reporte`);
      setStudentData(response.data.estudiante);
    } catch (error) {
      console.error('Error al obtener el reporte del estudiante:', error);
    }
  };

  const generateStudentPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text('Reporte de Estudiante', 105, y, { align: 'center' });
    y += 10;

    if (studentData) {
      doc.setFontSize(12);
      doc.text(`Nombre: ${studentData.nombre} ${studentData.ap_pat} ${studentData.ap_mat}`, 10, y);
      y += 10;
      doc.text(`Correo: ${studentData.correo}`, 10, y);
      y += 10;
      doc.text(`Equipo: ${studentData.empresa?.nombre_empresa || 'Sin equipo'}`, 10, y);
      y += 10;

      if (studentData.tareas && studentData.tareas.length > 0) {
        doc.text('Tareas Asignadas:', 10, y);
        y += 10;
        studentData.tareas.forEach((tarea) => {
          doc.text(`- ${tarea.nombre_tarea} (Estimación: ${tarea.estimacion})`, 15, y);
          y += 10;
        });
      }

      if (studentData.evaluaciones && studentData.evaluaciones.length > 0) {
        doc.text('Notas de Evaluación:', 10, y);
        y += 10;
        studentData.evaluaciones.autoevaluaciones.forEach((autoevaluacion) => {
          doc.text(`Autoevaluación ID ${autoevaluacion.id_autoe}:`, 10, y);
          y += 10;
          autoevaluacion.detalles.forEach((detalle) => {
            doc.text(`- ${detalle.criterio}: ${detalle.nota}`, 15, y);
            y += 10;
          });
        });

        studentData.evaluaciones.evaluaciones_pares.forEach((pares) => {
          doc.text(`Evaluación de Pares ID ${pares.id_pares}:`, 10, y);
          y += 10;
          pares.detalles.forEach((detalle) => {
            doc.text(`- ${detalle.criterio}: ${detalle.nota}`, 15, y);
            y += 10;
          });
        });

        studentData.evaluaciones.evaluaciones_docente.forEach((evaluacion) => {
          doc.text(`Evaluación Docente ID ${evaluacion.id_evaluacion}:`, 10, y);
          y += 10;
          doc.text(`- Nota: ${evaluacion.nota}`, 15, y);
          y += 10;
          doc.text(`- Comentario: ${evaluacion.comentario}`, 15, y);
          y += 10;
        });
      }
    }

    doc.save(`Reporte_Estudiante_${studentData?.nombre || 'Sin_Nombre'}.pdf`);
  };

  return (
    <div className="reporte-container">
      <h2>Reportes</h2>

      <div className="form-group">
        <label>Gestión:</label>
        <select value={gestion} onChange={handleGestionChange} className="select-gestion">
          {gestiones.map((g, index) => (
            <option key={index} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Sección de Reporte de Equipos */}
      <h2>Reporte de Equipos</h2>

      <div className="form-group">
        <label>Equipos:</label>
        <Select
          options={equipos.map((equipo) => ({
            value: equipo.id_empresa,
            label: equipo.nombre_empresa,
          }))}
          onChange={handleEquipoChange}
          placeholder="Selecciona un equipo"
          isClearable
        />
      </div>

      {reporteData && (
        <div className="reporte-content">
          <div className="reporte-header">
            {reporteData.logo && (
              <img
                src={reporteData.logo.startsWith('http') ? reporteData.logo : `http://localhost:8000/storage/${reporteData.logo}`}
                alt="Logo"
                className="reporte-logo"
              />
            )}
            <div className="reporte-details">
              <p><strong>Nombre del Equipo:</strong> {reporteData.nombre_empresa}</p>
              <p><strong>Nombre Corto:</strong> {reporteData.nombre_corto}</p>
              <p><strong>Teléfono:</strong> {reporteData.telefono}</p>
              <p><strong>Email:</strong> {reporteData.correo_empresa}</p>
            </div>
          </div>

          <button onClick={generatePDF} className="btn-pdf">Generar PDF</button>
        </div>
      )}

      {/* Sección de Reporte de Estudiantes */}
      <h2>Reporte de Estudiantes</h2>

      <div className="form-group">
        <label>Estudiantes:</label>
        <Select
          options={students.map((student) => ({
            value: student.id_estudiante,
            label: `${student.nombre_estudiante} ${student.ap_pat} ${student.ap_mat}`,
          }))}
          onChange={handleStudentChange}
          placeholder="Selecciona un estudiante"
          isClearable
        />
      </div>

      {studentData && (
        <div className="student-report">
          <h3>{`${studentData.nombre} ${studentData.ap_pat} ${studentData.ap_mat}`}</h3>
          <p><strong>Email:</strong> {studentData.correo}</p>
          <p><strong>Equipo:</strong> {studentData.empresa?.nombre_empresa || 'Sin equipo'}</p>

          <h4>Tareas Asignadas</h4>
          {studentData.tareas && studentData.tareas.length > 0 ? (
            <ul>
              {studentData.tareas.map((tarea) => (
                <li key={tarea.id_tarea}>
                  {tarea.nombre_tarea} (Estimación: {tarea.estimacion})
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay tareas asignadas.</p>
          )}

          <h4>Notas de Evaluación</h4>
          {studentData.evaluaciones && (
            <div>
              {/* Autoevaluaciones */}
              {studentData.evaluaciones.autoevaluaciones.length > 0 && (
                <div>
                  <h5>Autoevaluaciones</h5>
                  <ul>
                    {studentData.evaluaciones.autoevaluaciones.map((autoevaluacion) => (
                      <li key={autoevaluacion.id_autoe}>
                        <strong>ID {autoevaluacion.id_autoe}:</strong>
                        <ul>
                          {autoevaluacion.detalles.map((detalle, index) => (
                            <li key={index}>{detalle.criterio}: {detalle.nota}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evaluaciones de Pares */}
              {studentData.evaluaciones.evaluaciones_pares.length > 0 && (
                <div>
                  <h5>Evaluaciones de Pares</h5>
                  <ul>
                    {studentData.evaluaciones.evaluaciones_pares.map((pares) => (
                      <li key={pares.id_pares}>
                        <strong>ID {pares.id_pares}:</strong>
                        <ul>
                          {pares.detalles.map((detalle, index) => (
                            <li key={index}>{detalle.criterio}: {detalle.nota}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evaluaciones Docente */}
              {studentData.evaluaciones.evaluaciones_docente.length > 0 && (
                <div>
                  <h5>Evaluaciones Docente</h5>
                  <ul>
                    {studentData.evaluaciones.evaluaciones_docente.map((evaluacion) => (
                      <li key={evaluacion.id_evaluacion}>
                        <strong>ID {evaluacion.id_evaluacion}:</strong> Nota: {evaluacion.nota}, Comentario: {evaluacion.comentario || 'Sin comentario'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button onClick={generateStudentPDF} className="btn-pdf">Generar PDF</button>
        </div>
      )}
    </div>
  );
};

export default Reportes;
