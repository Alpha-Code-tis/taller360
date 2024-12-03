import { API_URL } from '../config';              
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './lightbox.css';
import './TareasEstudiante.css';

const TareasEstudiante = () => {
  const [tareas, setTareas] = useState([]);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [currentTareaId, setCurrentTareaId] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(1);

  // Obtener el token de autenticación (ajusta esto según cómo manejes la autenticación)
  const token = localStorage.getItem('token');

  // Configurar axios para incluir el token en los encabezados
  const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Obtener los sprints al montar el componente
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axiosInstance.get('sprints');
        setSprints(response.data);
      } catch (error) {
        console.error('Error al obtener los sprints:', error);
      }
    };

    fetchSprints();
  }, []);

  // Obtener las tareas cuando cambia el sprint seleccionado
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await axiosInstance.get(`tareas/${selectedSprint}`);
        const tareasConAvances = await Promise.all(
          response.data.map(async (tarea) => {
            // Fetch avances for each tarea
            try {
              const avancesResponse = await axiosInstance.get(`tareas/${tarea.id_tarea}/avances`);
              return { ...tarea, enlaces: avancesResponse.data };
            } catch (error) {
              console.error(`Error al obtener los avances de la tarea ${tarea.id_tarea}:`, error);
              return { ...tarea, enlaces: [] };
            }
          })
        );
        setTareas(tareasConAvances);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchTareas();
  }, [selectedSprint]);

  // Manejar la subida de enlaces
  const handleLinkUpload = async (event, id) => {
    const link = event.target.value;
    if (link) {
      try {
        await axiosInstance.post(`tareas/${id}/subir-avance`, { enlace: link });
        // Actualizar los enlaces en el estado
        setTareas((prevTareas) =>
          prevTareas.map((tarea) =>
            tarea.id_tarea === id
              ? { ...tarea, enlaces: [...(tarea.enlaces || []), link] }
              : tarea
          )
        );
        event.target.value = '';
      } catch (error) {
        console.error('Error al subir el enlace:', error);
      }
    }
  };

  // Manejar la vista de enlaces
  const handleViewLinks = (enlaces, id) => {
    if (enlaces.length > 0) {
      setSelectedLinks(enlaces);
      setCurrentTareaId(id);
      setLightboxVisible(true);
    } else {
      alert('No hay enlaces subidos para esta tarea.');
    }
  };

  // Manejar la eliminación de enlaces
  const handleDeleteLink = async (index) => {
    try {
      await axiosInstance.delete(`tareas/${currentTareaId}/avances/${index}`);
      const updatedLinks = selectedLinks.filter((_, i) => i !== index);

      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id_tarea === currentTareaId
            ? { ...tarea, enlaces: updatedLinks }
            : tarea
        )
      );

      setSelectedLinks(updatedLinks);

      if (updatedLinks.length === 0) {
        setLightboxVisible(false);
      }
    } catch (error) {
      console.error('Error al eliminar el enlace:', error);
    }
  };

  // Manejar el cambio de sprint seleccionado
  const handleSprintChange = (event) => {
    setSelectedSprint(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tareas</h2>
      <div className="sprint-select-container">
        <label htmlFor="sprint-select">Sprint</label>
        <select
          id="sprint-select"
          value={selectedSprint}
          onChange={handleSprintChange}
        >
          {sprints.map((sprint) => (
            <option key={sprint.id_sprint} value={sprint.id_sprint}>
              {sprint.nro_sprint}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Estimación</th>
            <th>Subir Avances</th>
            <th>Vista</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id_tarea}>
              <td>{tarea.nombre_tarea}</td>
              <td>{tarea.estimacion}</td>
              <td>
                <input
                  type="text"
                  placeholder="Ingresa un enlace"
                  onBlur={(e) => handleLinkUpload(e, tarea.id_tarea)}
                />
              </td>
              <td>
                <span
                  className="icono-ojo"
                  onClick={() =>
                    handleViewLinks(tarea.enlaces || [], tarea.id_tarea)
                  }
                >
                  👁️
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {lightboxVisible && (
        <div className="lightbox">
          <div className="lightbox-content">
            <span className="close" onClick={() => setLightboxVisible(false)}>
              &times;
            </span>
            {selectedLinks.length > 0 &&
              selectedLinks.map((enlace, index) => (
                <div key={index} className="lightbox-link-container">
                  <a href={enlace} target="_blank" rel="noopener noreferrer">
                    {enlace}
                  </a>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteLink(index)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasEstudiante;
