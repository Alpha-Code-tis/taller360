import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
// src/App.jsx
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import VistaDocentes from './Componentes/VistaDocente';
import VistaEstudiantes from './Componentes/VistaEstudiante';
import VistaAdministrador from './Componentes/VistaAdministrador';
import Login from './Componentes/Login';
import { Toaster } from 'react-hot-toast';
import Planificacion from './Representante_legal/Planificacion';
import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import Autoevaluacion from './Autoevaluacion/Autoevaluacion';
import ListaAutoevaluacion from './Autoevaluacion/ListaAutoevaluacion';
import Footer from './Componentes/Footer';
import Header from './Componentes/Header';
import PlanillasSemanales from './Planillas/GenerarPlanilla';
import './App.css';
import Seguimiento from './Representante_legal/Seguimiento';
import TareasEstudiante from './Estudiantes/TareasEstudiante'; // Asegúrate de que esta sea la ruta correcta
import GenerarPlanilla from './Administrador/GenerarPlanilla';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    } else {
      navigate('/Login');
    }
  }, [navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  };

  return (
    <div>

      <Toaster position="bottom-center" />
      {/* Solo mostrar Header y Footer si está autenticado */}
      {isAuthenticated && <Header />}

      <div className="main-content">
        {!isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/Login" element={<Login onLogin={handleLogin} />} />
          </Routes>
        ) : (
          <Routes>
            {role === 'administrador' && (
              <>
                <Route path="/Docentes" element={<Docentes />} />
                <Route path="/VistaAdministrador" element={<VistaAdministrador />} />
              </>
            )}
            {role === 'estudiante' && (
              <>
                <Route path="/VistaEstudiante" element={<VistaEstudiantes />} />
                <Route path="/Planificacion" element={<Planificacion />} />
                <Route path="/Equipos" element={<Equipos />} />
                <Route path="/Autoevaluacion" element={<Autoevaluacion />} />
              </>
            )}
            {role === 'docente' && (
              <>
                <Route path="/VistaDocente" element={<VistaDocentes />} />
                <Route path="/Estudiantes" element={<Estudiantes />} />
                <Route path="/ListaAutoevaluacion" element={<ListaAutoevaluacion />} />
              </>
            )}
            {/* <Route path="/Seguimiento" element={<Seguimiento />} />
            <Route path="/PlanillasSemanales" element={<PlanillasSemanales />} />
            <Route path="/TareasEstudiante" element={<TareasEstudiante />} />
            <Route path="/GenerarPlanilla" element={<GenerarPlanilla />} /> */}
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        )}
      </div>
  );
}

export default App;
