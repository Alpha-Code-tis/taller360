import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PlanillasSemanales.css'; // Estilo específico para las planillas

const PlanillasSemanales = () => {
  const [planillas, setPlanillas] = useState([]);

  useEffect(() => {
    const fetchPlanillas = async () => {
      try {
        const response = await axios.get('/api/planillas-semanales');
        setPlanillas(response.data);
      } catch (error) {
        console.error('Error al obtener planillas', error);
      }
    };
    fetchPlanillas();
  }, []); // <-- El array vacío asegura que useEffect solo se ejecute una vez

  return (
    <div className="planillas-container">
      <h2>Planillas Semanales (Temporales)</h2>
      <ul className="planillas-list">
        <li>
          <span>Ana Gomez - Semana 1</span>
          <button className="download-button">Descargar PDF</button>
        </li>
        <li>
          <span>Luis Martinez - Semana 2</span>
          <button className="download-button">Descargar PDF</button>
        </li>
      </ul>
    </div>
  );
  
};

export default PlanillasSemanales; 