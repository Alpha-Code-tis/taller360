import React, { useState, useEffect } from 'react';

const API_URL = "https://tu-api.com/";  // Asegúrate de usar la URL correcta de la API

const Evaluaciones = () => {
  // Estados para almacenar las opciones de evaluaciones y las fechas
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [fechas, setFechas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState(["autoevaluacion"]); // Valor inicial por defecto

  // useEffect para cargar las evaluaciones cuando el componente se monta
  useEffect(() => {
    // Función para obtener las fechas de las evaluaciones basadas en los tipos seleccionados
    const obtenerFechasEvaluaciones = async (tipos) => {
      try {
        // Crear la URL de la solicitud GET
        let url = `${API_URL}listaFechasEvaluaciones?tipos[]=${tipos[0]}`;

        // Añadir más tipos si es necesario
        if (tipos.length > 1) {
          tipos.forEach(tipo => {
            url += `&tipos[]=${tipo}`;
          });
        }

        // Hacer la solicitud GET
        const response = await fetch(url);
        const data = await response.json();

        // Actualizar las fechas en el estado
        setFechas(data);
      } catch (error) {
        console.error("Error al obtener las fechas de evaluaciones:", error);
      }
    };

    // Llamar a la función con los tipos seleccionados
    obtenerFechasEvaluaciones(selectedTipos);
  }, [selectedTipos]); // Se ejecuta cada vez que `selectedTipos` cambie

  // Manejar cambio en la selección del `select`
  const handleChange = (event) => {
    const { value } = event.target;
    // Si se selecciona una opción, actualizamos los tipos seleccionados
    setSelectedTipos(value.split(','));
  };

  return (
    <div>
      <h2>Selecciona las evaluaciones</h2>
      
      {/* Lista desplegable con las opciones */}
      <select onChange={handleChange} value={selectedTipos.join(',')}>
        <option value="autoevaluacion">Opción 1: Autoevaluación</option>
        <option value="pares">Opción 2: EV Pares</option>
        <option value="cruzada">Opción 3: EV Cruzada</option>
        <option value="autoevaluacion,pares">Opción 4: Autoevaluación + EV Pares</option>
        <option value="autoevaluacion,cruzada">Opción 5: Autoevaluación + EV Cruzada</option>
        <option value="pares,cruzada">Opción 6: EV Pares + EV Cruzada</option>
        <option value="autoevaluacion,pares,cruzada">Opción 7: Autoevaluación + EV Pares + EV Cruzada</option>
      </select>

      {/* Mostrar las fechas de las evaluaciones seleccionadas */}
      <div>
        <h3>Fechas de Evaluación:</h3>
        <ul>
          {fechas.length > 0 ? (
            fechas.map((evaluacion, index) => (
              <li key={index}>
                <strong>{evaluacion.nombre}</strong>: {evaluacion.fecha_inicio} - {evaluacion.fecha_fin}
              </li>
            ))
          ) : (
            <p>No se encontraron evaluaciones para mostrar.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Evaluaciones;
