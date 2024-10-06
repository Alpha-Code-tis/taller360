import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Planificacion from './Representante_legal/Planificacion';
import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import Login from './Componentes/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/Planificacion'); // Redirige a la página de Planificación después de iniciar sesión
  };

  return (
    <div>
      <Routes>
        {/* Ruta principal que muestra solo el login */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />

        {/* Rutas protegidas que se muestran solo si el usuario está autenticado */}
        {isAuthenticated ? (
          <>
            <Route path="/Planificacion" element={<Planificacion />} />
            <Route path="/Docentes" element={<Docentes />} />
            <Route path="/Estudiantes" element={<Estudiantes />} />
            <Route path="/Equipos" element={<Equipos />} />
          </>
        ) : (
          // Asegúrate de redirigir al login si no está autenticado
          <Route path="/Login" element={<Login onLogin={handleLogin} />} />
        )}

        {/* Redirige a Login si el usuario intenta acceder a una ruta no válida */}
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;
