import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './lightbox.css';
import './TareasEstudiante.css';

const TareasEstudiante = () => {
  const [tareas, setTareas] = useState([]);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentTareaId, setCurrentTareaId] = useState(null);

  // Obtener los sprints y tareas cuando el componente se monta
  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const sprintsResponse = await axios.get('/tareas/sprints');
        if (sprintsResponse.data.length > 0) {
          const sprintId = sprintsResponse.data[0].id_sprint; // Usar el primer sprint como ejemplo
          const tareasResponse = await axios.get(`/tareas/${sprintId}`);
          setTareas(tareasResponse.data);
        }
      } catch (error) {
        console.error('Error al obtener sprints o tareas:', error);
      }
    };

    fetchSprints();
  }, []);

  const handleFileUpload = async (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await axios.post(`/tareas/${id}/subir-avance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Actualizar la tarea con la nueva imagen
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id === id ? { ...tarea, imagenes: [...tarea.imagenes, response.data.path] } : tarea
        )
      );
    } catch (error) {
      console.error('Error al subir el avance:', error);
    }
  };

  const handleViewImages = async (id) => {
    try {
      const response = await axios.get(`/tareas/${id}/avances`);
      if (response.data.length > 0) {
        setSelectedImages(response.data);
        setCurrentTareaId(id);
        setLightboxVisible(true);
      } else {
        alert('No hay imágenes subidas para esta tarea.');
      }
    } catch (error) {
      console.error('Error al obtener los avances:', error);
    }
  };

  const handleDeleteImage = async (index) => {
    try {
      await axios.delete(`/tareas/${currentTareaId}/avances/${index}`);
      const updatedImages = selectedImages.filter((_, i) => i !== index);

      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id === currentTareaId
            ? { ...tarea, imagenes: updatedImages }
            : tarea
        )
      );

      setSelectedImages(updatedImages);

      if (updatedImages.length === 0) {
        setLightboxVisible(false);
      }
    } catch (error) {
      console.error('Error al eliminar el avance:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tareas</h2>
      <table>
        <thead>
          <tr>
            <th>Tarea</th>
            <th>Progreso</th>
            <th>Subir Avances</th>
            <th>Vista</th> {/* Nueva columna de "Vista" */}
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id}>
              <td>{tarea.nombre}</td>
              <td>{tarea.progreso}</td>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, tarea.id)}
                />
                <ul>
                  {tarea.imagenes.map((imagen, index) => (
                    <li key={index}>{imagen}</li>
                  ))}
                </ul>
              </td>
              <td>
                <span
                  className="icono-ojo"
                  onClick={() => handleViewImages(tarea.id)}
                >
                  👁️
                </span> {/* Uso del icono de ojo */}
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
                    src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`}
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