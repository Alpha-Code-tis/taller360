// src/components/Reportes.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { API_URL } from '../config';    
import { Modal, Button } from 'react-bootstrap'; // Importar componentes de React Bootstrap
import './ReporteEquipoEstudiante.css'; // Importar estilos

const Reportes = () => {
    const [gestion, setGestion] = useState('2-2024');
    const [gestiones, setGestiones] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [selectedEquipo, setSelectedEquipo] = useState(null);
    const [reporteData, setReporteData] = useState(null);

    // Estados para estudiantes
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentData, setStudentData] = useState(null);

    // Estados para modales
    const [showEquipoModal, setShowEquipoModal] = useState(false);
    const [showEstudianteModal, setShowEstudianteModal] = useState(false);

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
            const response = await axios.get(`${API_URL}gestiones`);
            setGestiones(response.data);
        } catch (error) {
            console.error('Error al obtener las gestiones:', error);
        }
    };

    const fetchEquipos = async () => {
        try {
            const response = await axios.get(`${API_URL}equipos`, {
                params: { gestion }
            });
            setEquipos(response.data);
        } catch (error) {
            console.error('Error al obtener los equipos:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_URL}estudiantes`);
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
            const response = await axios.get(`${API_URL}empresa/${id_empresa}/reporte`, {
                params: { gestion }
            });
            setReporteData(response.data.empresa);
        } catch (error) {
            console.error('Error al obtener el reporte:', error);
        }
    };

    const generatePDF = () => {
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40;
            let y = margin;
    
            // Título
            doc.setFontSize(14);
            doc.setTextColor(35);
            doc.text('Reporte de Equipo', pageWidth / 2, y, { align: 'center' });
            y += 20;
    
            // Logo de la Empresa
            if (reporteData.logo) {
                const logoUrl = reporteData.logo.startsWith('http') ? reporteData.logo : `${API_URL}storage/${reporteData.logo}`;
                // Asegúrate de que la imagen esté en formato compatible (PNG, JPEG)
                doc.addImage(logoUrl, 'PNG', margin, y, 80, 80);
            }
    
            // Detalles de la Empresa
            doc.setFontSize(9);
            doc.setTextColor(0);
            const detailsX = reporteData.logo ? margin + 90 : margin;
            doc.text(`Nombre del Equipo: ${reporteData.nombre_empresa}`, detailsX, y + 15);
            doc.text(`Nombre Corto: ${reporteData.nombre_corto}`, detailsX, y + 30);
            doc.text(`Teléfono: ${reporteData.telefono}`, detailsX, y + 45);
            doc.text(`Correo Electrónico: ${reporteData.correo_empresa}`, detailsX, y + 60);
            y += 80;
    
            // Estudiantes Seleccionados
            if (reporteData.estudiantesSeleccionados && reporteData.estudiantesSeleccionados.length > 0) {
                doc.setFontSize(11);
                doc.setTextColor(40);
                doc.text('Estudiantes Seleccionados:', margin, y);
                y += 20;
    
                const studentNames = reporteData.estudiantesSeleccionados.map(est => est.nombre);
                doc.setFontSize(9);
                doc.text(studentNames.join(', '), margin, y);
                y += 20;
            }
    
            // Planificaciones
            if (reporteData.planificaciones && reporteData.planificaciones.length > 0) {
                doc.setFontSize(11);
                doc.setTextColor(40);
                doc.text('Planificación:', margin, y);
                y += 20;
    
                reporteData.planificaciones.forEach((planificacion, index) => {
                    doc.setFontSize(9);
                    doc.text(`Planificación ${index + 1}:`, margin + 20, y);
                    y += 20;
    
                    if (planificacion.sprints && planificacion.sprints.length > 0) {
                        planificacion.sprints.forEach((sprint) => {
                            const fechaInicio = new Date(sprint.fecha_inicio).toLocaleDateString();
                            const fechaFin = new Date(sprint.fecha_fin).toLocaleDateString();
                            doc.text(`Sprint ${sprint.nro_sprint} (Inicio: ${fechaInicio}, Fin: ${fechaFin})`, margin + 40, y);
                            y += 20;
    
                            // Tabla de Alcances y Tareas
                            const tableColumn = ["Alcance", "Descripción de Tareas", "Estimación"];
                            const tableRows = [];
    
                            if (sprint.alcances && sprint.alcances.length > 0) {
                                sprint.alcances.forEach(alcance => {
                                    if (alcance.tareas && alcance.tareas.length > 0) {
                                        alcance.tareas.forEach(tarea => {
                                            tableRows.push([
                                                alcance.descripcion,
                                                tarea.nombre_tarea,
                                                tarea.estimacion
                                            ]);
                                        });
                                    }
                                });
                            }
    
                            if (tableRows.length > 0) {
                                doc.autoTable({
                                    startY: y,
                                    head: [tableColumn],
                                    body: tableRows,
                                    theme: 'grid',
                                    styles: { fontSize: 10 },
                                    headStyles: { fillColor: [22, 160, 133] },
                                    margin: { left: margin + 40, right: margin },
                                    didDrawPage: (data) => {
                                        // Agregar una línea debajo de la tabla
                                        // doc.setLineWidth(0.5);
                                        // doc.line(margin, data.cursor.y + 10, pageWidth - margin, data.cursor.y + 10);
                                    }
                                });
                                y = doc.lastAutoTable.finalY + 20;
                            } else {
                                doc.setFontSize(12);
                                doc.text('No hay tareas asignadas para este sprint.', margin + 40, y);
                                y += 20;
                            }
                        });
                    } else {
                        doc.setFontSize(12);
                        doc.text('No hay sprints asignados para esta planificación.', margin + 20, y);
                        y += 20;
                    }
                });
            }
    
            // Evaluaciones Cruzadas
            if (reporteData.evaluacionesCruzadas && reporteData.evaluacionesCruzadas.length > 0) {
                doc.setFontSize(11);
                doc.setTextColor(40);
                doc.text('Evaluaciones Cruzadas:', margin, y);
                y += 20;
    
                reporteData.evaluacionesCruzadas.forEach((evalCruzada) => {
                    doc.setFontSize(9);
                    doc.text(`Evaluador: ${evalCruzada.evaluator}`, margin + 20, y);
                    y += 20;
    
                    // Verificar si detalle_notas no es null y es un array
                    if (Array.isArray(evalCruzada.detalle_notas) && evalCruzada.detalle_notas.length > 0) {
                        // Tabla de Detalle de Notas
                        const tableColumn = ["Criterio", "Nota"];
                        const tableRows = evalCruzada.detalle_notas.map(detalle => [
                            detalle.criterio_nombre || 'N/A',
                            detalle.nota !== null && detalle.nota !== undefined ? detalle.nota : 'N/A'
                        ]);
    
                        doc.autoTable({
                            startY: y,
                            head: [tableColumn],
                            body: tableRows,
                            theme: 'striped',
                            styles: { fontSize: 9 },
                            headStyles: { fillColor: [52, 73, 94] },
                            margin: { left: margin + 40, right: margin },
                            didDrawPage: (data) => {
                                // Agregar una línea debajo de la tabla
                                // doc.setLineWidth(0.5);
                                // doc.line(margin, data.cursor.y + 10, pageWidth - margin, data.cursor.y + 10);
                            }
                        });
                        y = doc.lastAutoTable.finalY + 20;
                    } else {
                        doc.setFontSize(9);
                        doc.text('No hay detalles de notas disponibles para esta evaluación cruzada.', margin + 40, y);
                        y += 20;
                    }
                });
            }
    
            // Pie de Página con Número de Página
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 30, { align: 'center' });
            }
    
            doc.save(`Reporte_Equipo_${reporteData?.nombre_corto || 'Sin_Nombre'}.pdf`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Por favor, intenta nuevamente.');
        }
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
            const response = await axios.get(`${API_URL}estudiante/${id_estudiante}/reporte`);
            setStudentData(response.data.estudiante);
        } catch (error) {
            console.error('Error al obtener el reporte del estudiante:', error);
            alert('Error al obtener el reporte del estudiante. Por favor, intenta nuevamente.');
        }
    };

    const generateStudentPDF = () => {
        try {
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 40;
            let y = margin;
    
            // Título
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text('Reporte de Estudiante', pageWidth / 2, y, { align: 'center' });
            y += 30;
    
            // Información Personal
            doc.setFontSize(11);
            doc.text('Información Personal:', margin, y);
            y += 20;
    
            doc.setFontSize(9);
            doc.text(`Nombre: ${studentData.nombre} ${studentData.ap_pat} ${studentData.ap_mat}`, margin + 15, y);
            y += 15;
            doc.text(`Código SIS: ${studentData.codigo_sis}`, margin + 15, y);
            y += 15;
            doc.text(`Correo: ${studentData.correo}`, margin + 15, y);
            y += 15;
            doc.text(`Equipo: ${studentData.empresa?.nombre_empresa || 'Sin equipo'}`, margin + 15, y);
            y += 25;
    
            // Tareas Asignadas
            doc.setFontSize(11);
            doc.text('Tareas Asignadas:', margin, y);
            y += 15;
    
            if (studentData.tareas && studentData.tareas.length > 0) {
                const tableColumn = ["Nombre de Tarea", "Estimación", "Estado", "Resultado Evaluación", "Descripción Evaluación"];
                const tableRows = studentData.tareas.map(tarea => [
                    tarea.nombre_tarea,
                    tarea.estimacion,
                    tarea.estado || '-',
                    tarea.resultado_evaluacion || '-',
                    tarea.descripcion_evaluacion || '-'
                ]);
    
                doc.autoTable({
                    startY: y,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'grid',
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [22, 160, 133] },
                    margin: { left: margin, right: margin },
                    didDrawPage: (data) => {
                        // Agregar una línea debajo de la tabla
                        // doc.setLineWidth(0.5);
                        // doc.line(margin, data.cursor.y + 10, pageWidth - margin, data.cursor.y + 10);
                    }
                });
                y = doc.lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(11);
                doc.text('No hay tareas asignadas.', margin + 20, y);
                y += 20;
            }
    
            // Evaluaciones Finales
            doc.setFontSize(11);
            doc.text('Evaluaciones Finales:', margin, y);
            y += 20;
    
            if (studentData.evaluacionesFinales && studentData.evaluacionesFinales.length > 0) {
                const tableColumn = ["ID Evaluación", "Autoevaluación", "Evaluación de Pares", "Evaluación Docente", "Paga", "Fecha Evaluación"];
                const tableRows = studentData.evaluacionesFinales.map(evaluacion => [
                    evaluacion.id_evaluacion_final,
                    evaluacion.autoevaluacion,
                    evaluacion.pares,
                    evaluacion.evaluaciondocente,
                    evaluacion.paga,
                    new Date(evaluacion.fecha_evaluacion).toLocaleDateString()
                ]);
    
                doc.autoTable({
                    startY: y,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'striped',
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [52, 73, 94] },
                    margin: { left: margin, right: margin },
                    didDrawPage: (data) => {
                        // Agregar una línea debajo de la tabla
                        // doc.setLineWidth(0.5);
                        // doc.line(margin, data.cursor.y + 10, pageWidth - margin, data.cursor.y + 10);
                    }
                });
                y = doc.lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(9);
                doc.text('No hay evaluaciones finales disponibles.', margin + 20, y);
                y += 20;
            }
    
            // Criterios Evaluados
            doc.setFontSize(11);
            doc.text('Criterios Evaluados:', margin, y);
            y += 20;
    
            if (studentData.criteriosEvaluados && studentData.criteriosEvaluados.length > 0) {
                const tableColumn = ["Criterio", "Descripción", "Evaluador ID", "Sprint ID"];
                const tableRows = studentData.criteriosEvaluados.map(criterio => [
                    criterio.nombre_criterio,
                    criterio.descripcion,
                    criterio.evaluador.id_estudiante_evaluador,
                    criterio.id_sprint
                ]);
    
                doc.autoTable({
                    startY: y,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'grid',
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [39, 174, 96] },
                    margin: { left: margin, right: margin },
                    didDrawPage: (data) => {
                        // Agregar una línea debajo de la tabla
                        // doc.setLineWidth(0.5);
                        // doc.line(margin, data.cursor.y + 10, pageWidth - margin, data.cursor.y + 10);
                    }
                });
                y = doc.lastAutoTable.finalY + 20;
            } else {
                doc.setFontSize(11);
                doc.text('No hay criterios evaluados disponibles.', margin + 20, y);
                y += 20;
            }
    
            // Pie de Página con Número de Página
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 30, { align: 'center' });
            }
    
            doc.save(`Reporte_Estudiante_${studentData?.nombre || 'Sin_Nombre'}.pdf`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Ocurrió un error al generar el PDF. Por favor, intenta nuevamente.');
        }
    };

    const handleShowEquipoModal = () => setShowEquipoModal(true);
    const handleCloseEquipoModal = () => setShowEquipoModal(false);

    const handleShowEstudianteModal = () => setShowEstudianteModal(true);
    const handleCloseEstudianteModal = () => setShowEstudianteModal(false);

    return (
        <div className="reporte-container">
            <h2>Reportes</h2>

            <div className="form-group">
                <label htmlFor="gestion">Gestión:</label>
                <select
                    id="gestion"
                    value={gestion}
                    onChange={handleGestionChange}
                    className="select-gestion"
                >
                    {gestiones.map((g, index) => (
                        <option key={index} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contenedor Flex para los dos reportes */}
            <div className="reportes-wrapper">
                {/* Sección de Reporte de Equipos */}
                <div>
                    <h2>Reporte de Equipos</h2>

                    <div className="form-group">
                        <label htmlFor="equipo">Equipos:</label>
                        <Select
                            id="equipo"
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

                            <div className="btn-group">
                                <button onClick={generatePDF} className="btn-pdf">Generar PDF</button>
                                <button onClick={handleShowEquipoModal} className="btn-detalles">Detalles de Equipo</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección de Reporte de Estudiantes */}
                <div>
                    <h2>Reporte de Estudiantes</h2>

                    <div className="form-group">
                        <label htmlFor="estudiante">Estudiantes:</label>
                        <Select
                            id="estudiante"
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
                            <p><strong>Código SIS:</strong> {studentData.codigo_sis}</p>
                            <p><strong>Email:</strong> {studentData.correo}</p>
                            <p><strong>Equipo:</strong> {studentData.empresa?.nombre_empresa || 'Sin equipo'}</p>
                            <div className="btn-group">
                                <button onClick={generateStudentPDF} className="btn-pdf">Generar PDF</button>
                                <button onClick={handleShowEstudianteModal} className="btn-detalles">Detalles de Estudiante</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Detalles de Equipo */}
            <Modal show={showEquipoModal} onHide={handleCloseEquipoModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Equipo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reporteData ? (
                        <div>
                            {/* Logo de la Empresa */}
                            {reporteData.logo && (
                                <img
                                    src={reporteData.logo.startsWith('http') ? reporteData.logo : `http://localhost:8000/storage/${reporteData.logo}`}
                                    alt="Logo"
                                    style={{ width: '100px', height: 'auto', marginBottom: '20px' }}
                                />
                            )}
                            {/* Detalles Completo del Equipo */}
                            <p><strong>Nombre del Equipo:</strong> {reporteData.nombre_empresa}</p>
                            <p><strong>Nombre Corto:</strong> {reporteData.nombre_corto}</p>
                            <p><strong>Teléfono:</strong> {reporteData.telefono}</p>
                            <p><strong>Email:</strong> {reporteData.correo_empresa}</p>
                            <p><strong>Gestión:</strong> {gestion}</p>
                            
                            {/* Estudiantes Seleccionados */}
                            <h5>Estudiantes Seleccionados:</h5>
                            {reporteData.estudiantesSeleccionados && reporteData.estudiantesSeleccionados.length > 0 ? (
                                <ul>
                                    {reporteData.estudiantesSeleccionados.map((estudiante, idx) => (
                                        <li key={idx}>{estudiante.nombre}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay estudiantes seleccionados.</p>
                            )}

                            {/* Planificaciones */}
                            <h5>Planificaciones:</h5>
                            {reporteData.planificaciones && reporteData.planificaciones.length > 0 ? (
                                reporteData.planificaciones.map((planificacion, index) => (
                                    <div key={index} style={{ marginBottom: '15px' }}>
                                        <p><strong>Planificación {index + 1}:</strong></p>
                                        {planificacion.sprints && planificacion.sprints.length > 0 ? (
                                            <ul>
                                                {planificacion.sprints.map((sprint, idx) => (
                                                    <li key={idx}>
                                                        <strong>Sprint {sprint.nro_sprint}:</strong> Inicio: {new Date(sprint.fecha_inicio).toLocaleDateString()}, Fin: {new Date(sprint.fecha_fin).toLocaleDateString()}
                                                        <ul>
                                                            {sprint.alcances && sprint.alcances.length > 0 ? (
                                                                sprint.alcances.map((alcance, aIdx) => (
                                                                    <li key={aIdx}>
                                                                        <strong>Alcance:</strong> {alcance.descripcion}
                                                                        <ul>
                                                                            {alcance.tareas && alcance.tareas.length > 0 ? (
                                                                                alcance.tareas.map((tarea, tIdx) => (
                                                                                    <li key={tIdx}>
                                                                                        <strong>Tarea:</strong> {tarea.nombre_tarea} (Estimación: {tarea.estimacion})
                                                                                    </li>
                                                                                ))
                                                                            ) : (
                                                                                <li>No hay tareas asignadas.</li>
                                                                            )}
                                                                        </ul>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li>No hay alcances asignados.</li>
                                                            )}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay sprints asignados.</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No hay planificaciones asignadas.</p>
                            )}

                            {/* Evaluaciones Cruzadas */}
                            <h5>Evaluaciones Cruzadas:</h5>
                            {reporteData.evaluacionesCruzadas && reporteData.evaluacionesCruzadas.length > 0 ? (
                                reporteData.evaluacionesCruzadas.map((evalCruzada, idx) => (
                                    <div key={idx} style={{ marginBottom: '15px' }}>
                                        <p><strong>Evaluador:</strong> {evalCruzada.evaluator}</p>
                                        {evalCruzada.detalle_notas && evalCruzada.detalle_notas.length > 0 ? (
                                            <ul>
                                                {evalCruzada.detalle_notas.map((detalle, dIdx) => (
                                                    <li key={dIdx}>
                                                        <strong>Criterio:</strong> {detalle.criterio_nombre || 'N/A'} - <strong>Nota:</strong> {detalle.nota !== null && detalle.nota !== undefined ? detalle.nota : 'N/A'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay detalles de notas disponibles.</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No hay evaluaciones cruzadas.</p>
                            )}
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEquipoModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Detalles de Estudiante */}
            <Modal show={showEstudianteModal} onHide={handleCloseEstudianteModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Estudiante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {studentData ? (
                        <div>
                            {/* Información Personal */}
                            <p><strong>Nombre:</strong> {studentData.nombre} {studentData.ap_pat} {studentData.ap_mat}</p>
                            <p><strong>Código SIS:</strong> {studentData.codigo_sis}</p>
                            <p><strong>Email:</strong> {studentData.correo}</p>
                            <p><strong>Equipo:</strong> {studentData.empresa?.nombre_empresa || 'Sin equipo'}</p>

                            {/* Tareas Asignadas */}
                            <h5>Tareas Asignadas:</h5>
                            {studentData.tareas && studentData.tareas.length > 0 ? (
                                <ul>
                                    {studentData.tareas.map((tarea, idx) => (
                                        <li key={idx}>
                                            <strong>Nombre de Tarea:</strong> {tarea.nombre_tarea} (Estimación: {tarea.estimacion})
                                            <ul>
                                                <li><strong>Estado:</strong> {tarea.estado || 'N/A'}</li>
                                                <li><strong>Resultado Evaluación:</strong> {tarea.resultado_evaluacion || 'N/A'}</li>
                                                <li><strong>Descripción Evaluación:</strong> {tarea.descripcion_evaluacion || 'N/A'}</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay tareas asignadas.</p>
                            )}

                            {/* Evaluaciones Finales */}
                            <h5>Evaluaciones Finales:</h5>
                            {studentData.evaluacionesFinales && studentData.evaluacionesFinales.length > 0 ? (
                                <ul>
                                    {studentData.evaluacionesFinales.map((evaluacion, idx) => (
                                        <li key={idx}>
                                            <strong>ID Evaluación:</strong> {evaluacion.id_evaluacion_final}
                                            <ul>
                                                <li><strong>Autoevaluación:</strong> {evaluacion.autoevaluacion}</li>
                                                <li><strong>Evaluación de Pares:</strong> {evaluacion.pares}</li>
                                                <li><strong>Evaluación Docente:</strong> {evaluacion.evaluaciondocente}</li>
                                                <li><strong>Paga:</strong> {evaluacion.paga}</li>
                                                <li><strong>Fecha Evaluación:</strong> {new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay evaluaciones finales disponibles.</p>
                            )}

                            {/* Criterios Evaluados */}
                            <h5>Criterios Evaluados:</h5>
                            {studentData.criteriosEvaluados && studentData.criteriosEvaluados.length > 0 ? (
                                <ul>
                                    {studentData.criteriosEvaluados.map((criterio, idx) => (
                                        <li key={idx}>
                                            <strong>Criterio:</strong> {criterio.nombre_criterio}
                                            <ul>
                                                <li><strong>Descripción:</strong> {criterio.descripcion}</li>
                                                <li><strong>Evaluador ID:</strong> {criterio.evaluador.id_estudiante_evaluador}</li>
                                                <li><strong>Sprint ID:</strong> {criterio.id_sprint}</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay criterios evaluados disponibles.</p>
                            )}
                        </div>
                    ) : (
                        <p>No hay datos disponibles.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEstudianteModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

};

export default Reportes;
