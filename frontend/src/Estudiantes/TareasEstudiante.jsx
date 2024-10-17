// src/components/TareasEstudiante.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './lightbox.css';
import './TareasEstudiante.css';
import { useParams } from 'react-router-dom';

const TareasEstudiante = () => {
  const { sprintId } = useParams(); // Obtén el ID del sprint de los parámetros de la URL
  const [tareas, setTareas] = useState([]);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentTareaId, setCurrentTareaId] = useState(null);

  useEffect(() => {
    // Cargar las tareas del estudiante
    const cargarTareas = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tareas/${sprintId}`);
        if (response.data && Array.isArray(response.data)) {
          const tareasConImagenes = response.data.map((tarea) => ({
            ...tarea,
            imagenes: tarea.avances ? tarea.avances.split(',') : [],
          }));
          setTareas(tareasConImagenes);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };
    cargarTareas();
  }, [sprintId]);

  const handleFileUpload = async (event, id) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await axios.post(`http://localhost:8000/api/tareas/${id}/subir-avance`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar la lista de tareas con el nuevo avance
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id_tarea === id
            ? { ...tarea, imagenes: [...tarea.imagenes, response.data.path] }
            : tarea
        )
      );
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  const handleViewImages = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tareas/${id}/avances`);
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

  const handleDeleteImage = async (avanceIndex) => {
    try {
      await axios.delete(`http://localhost:8000/api/tareas/${currentTareaId}/avances/${avanceIndex}`);

      const updatedImages = selectedImages.filter((_, index) => index !== avanceIndex);
      setSelectedImages(updatedImages);

      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.id_tarea === currentTareaId
            ? { ...tarea, imagenes: updatedImages }
            : tarea
        )
      );

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
            <th>Vista</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id_tarea}>
              <td>{tarea.nombre_tarea}</td>
              <td>{tarea.progreso}%</td>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, tarea.id_tarea)}
                />
              </td>
              <td>
                <span
                  className="icono-ojo"
                  onClick={() => handleViewImages(tarea.id_tarea)}
                  style={{ cursor: 'pointer' }}
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
                    src={`http://localhost:8000/storage/${imagen}`}
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
