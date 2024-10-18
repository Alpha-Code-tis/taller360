import { API_URL } from '../config';              
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './lightbox.css';
import './TareasEstudiante.css';

const TareasEstudiante = () => {
  const [tareas, setTareas] = useState([]); // Estado para almacenar tareas
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentTareaId, setCurrentTareaId] = useState(null);
  const [sprints, setSprints] = useState([]); // Estado para almacenar los sprints
  const [selectedSprint, setSelectedSprint] = useState(1); // Sprint seleccionado

  // Obtener los sprints al montar el componente
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get(`${API_URL}sprints`);
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
        const response = await axios.get(`${API_URL}sprints/${selectedSprint}/tareas`);
        setTareas(response.data); // Guardar las tareas obtenidas de la API
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchTareas();
  }, [selectedSprint]); // Ejecuta cuando cambia el sprint seleccionado

  // Manejar la subida de archivos
  const handleFileUpload = (event, id) => {
    const files = Array.from(event.target.files);
    setTareas((prevTareas) =>
      prevTareas.map((tarea) =>
        tarea.id_tarea === id
          ? { ...tarea, imagenes: [...(tarea.imagenes || []), ...files] }
          : tarea
      )
    );
  };

  // Manejar la vista de imágenes
  const handleViewImages = (imagenes, id) => {
    if (imagenes.length > 0) {
      setSelectedImages(imagenes);
      setCurrentTareaId(id);
      setLightboxVisible(true);
    } else {
      alert('No hay imágenes subidas para esta tarea.');
    }
  };

  // Manejar la eliminación de imágenes
  const handleDeleteImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);

    setTareas((prevTareas) =>
      prevTareas.map((tarea) =>
        tarea.id_tarea === currentTareaId
          ? { ...tarea, imagenes: updatedImages }
          : tarea
      )
    );

    setSelectedImages(updatedImages);

    if (updatedImages.length === 0) {
      setLightboxVisible(false);
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
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, tarea.id_tarea)}
                  multiple
                />
                <ul>
                  {(tarea.imagenes || []).map((imagen, index) => (
                    <li key={index}>{imagen.name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <span
                  className="icono-ojo"
                  onClick={() => handleViewImages(tarea.imagenes || [], tarea.id_tarea)}
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
            {selectedImages.length > 0 &&
              selectedImages.map((imagen, index) => (
                <div key={index} className="lightbox-image-container">
                  <img
                    src={URL.createObjectURL(imagen)}
                    alt={`Imagen ${index + 1}`}
                    className="lightbox-image"
                  />
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteImage(index)}
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
