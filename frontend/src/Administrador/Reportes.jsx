import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import './Reportes.css';

const Reportes = () => {
    const [empresas, setEmpresas] = useState([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}equipos`)
            .then(response => {
                console.log('Empresas recibidas:', response.data);
                setEmpresas(response.data);
            })
            .catch(error => console.error('Error al cargar las empresas:', error));
    }, []);

    const handleSelectChange = async (event) => {
        const id_empresa = event.target.value;

        try {
          const response = await axios.get(`${API_URL}empresa/${id_empresa}/reporte`);
          console.log('Detalles de la empresa seleccionada:', response.data);
            setEmpresaSeleccionada(response.data);
        } catch (error) {
            console.error('Error al cargar los detalles de la empresa:', error);
        }
    };

    return (
        <div className="container">
            <h1>Empresas de la Gestión 2-2024</h1>

            <div className="filter-section">
                <label htmlFor="empresa-select">Filtrar Empresas:</label>
                <select
                    id="empresa-select"
                    className="empresa-select"
                    onChange={handleSelectChange}
                    defaultValue=""
                >
                    <option value="" disabled>Selecciona una empresa</option>
                    {empresas.map(empresa => (
                        <option key={empresa.id_empresa} value={empresa.id_empresa}>
                            {empresa.nombre_empresa}
                        </option>
                    ))}
                </select>
            </div>

            {empresaSeleccionada && (
                <div className="detalles">
                    <h2>Detalles de {empresaSeleccionada.nombre_empresa}</h2>
                    <p><strong>Nombre corto:</strong> {empresaSeleccionada.nombre_corto}</p>
                    <p><strong>Correo:</strong> {empresaSeleccionada.correo_empresa}</p>
                    <p><strong>Teléfono:</strong> {empresaSeleccionada.telefono}</p>
                    <p><strong>Dirección:</strong> {empresaSeleccionada.direccion}</p>

                    <h3>Estudiantes en el equipo</h3>
                    {empresaSeleccionada.estudiantes && empresaSeleccionada.estudiantes.length > 0 ? (
                        <ul>
                            {empresaSeleccionada.estudiantes.map(estudiante => (
                                <li key={estudiante.id_estudiante}>
                                    {estudiante.nombre_estudiante} {estudiante.ap_pat} {estudiante.ap_mat}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay estudiantes asignados a esta empresa.</p>
                    )}

                    <h3>Tareas Asignadas</h3>
                    {empresaSeleccionada.planificacion?.sprints && empresaSeleccionada.planificacion.sprints.length > 0 ? (
                        empresaSeleccionada.planificacion.sprints.map(sprint => (
                            <div key={sprint.id_sprint}>
                                <h4>Sprint {sprint.nro_sprint}:</h4>
                                <p>{sprint.fecha_inicio} - {sprint.fecha_fin}</p>
                                {sprint.alcances?.length > 0 && sprint.alcances.map(alcance => (
                                    <div key={alcance.id_alcance}>
                                        <h5>Alcance: {alcance.descripcion}</h5>
                                        {alcance.tareas && alcance.tareas.length > 0 ? (
                                            <ul>
                                                {alcance.tareas.map(tarea => (
                                                    <li key={tarea.id_tarea}>{tarea.nombre_tarea}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay tareas para este alcance.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No hay sprints disponibles para esta empresa.</p>
                    )}

                    <h3>Criterios de Evaluación</h3>
                    {empresaSeleccionada.criterios && empresaSeleccionada.criterios.length > 0 ? (
                        <ul>
                            {empresaSeleccionada.criterios.map(criterio => (
                                <li key={criterio.id_criterio}>
                                    {criterio.nombre}: {criterio.descripcion} ({criterio.porcentaje}%)
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay criterios de evaluación definidos.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reportes;
