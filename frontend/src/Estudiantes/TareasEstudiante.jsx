import React, { useState } from 'react';
import './lightbox.css';
import './TareasEstudiante.css';

const TareasEstudiante = () => {
  const [tareas, setTareas] = useState([
    { id: 1, nombre: 'Registrar docente', progreso: '40%', imagenes: [] },
    { id: 2, nombre: 'Visualizar planilla', progreso: '20%', imagenes: [] },
    { id: 3, nombre: 'Registrar equipo', progreso: '0%', imagenes: [] },
    { id: 4, nombre: 'Autentificar usuarios', progreso: '100%', imagenes: [] },
    { id: 5, nombre: 'Registrar estudiantes', progreso: '80%', imagenes: [] }
  ]);

  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentTareaId, setCurrentTareaId] = useState(null);

  const handleFileUpload = (event, id) => {
    const files = Array.from(event.target.files);
    setTareas((prevTareas) =>
      prevTareas.map((tarea) =>
        tarea.id === id
          ? { ...tarea, imagenes: [...tarea.imagenes, ...files] }
          : tarea
      )
    );
  };

  const handleViewImages = (imagenes, id) => {
    if (imagenes.length > 0) {
      setSelectedImages(imagenes);
      setCurrentTareaId(id);
      setLightboxVisible(true);
    } else {
      alert('No hay imágenes subidas para esta tarea.');
    }
  };

  const handleDeleteImage = (index) => {
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
                  multiple
                />
                <ul>
                  {tarea.imagenes.map((imagen, index) => (
                    <li key={index}>{imagen.name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <span
                  className="icono-ojo"
                  onClick={() => handleViewImages(tarea.imagenes, tarea.id)}
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
            {selectedImages.length > 0 && (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TareasEstudiante;
