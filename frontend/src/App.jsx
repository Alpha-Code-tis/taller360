import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import VistaDocentes from './Componentes/VistaDocente';
import VistaEstudiantes from './Componentes/VistaEstudiante';
import VistaAdministrador from './Componentes/VistaAdministrador';
import PlanificacionEquipos from './Equipos/PlanificacionEquipos';
import Login from './Componentes/Login';
import { Toaster } from 'react-hot-toast';
import Planificacion from './Representante_legal/Planificacion';
import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import './App.css';
import axios from 'axios';import Seguimiento from './Representante_legal/Seguimiento';
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
      <Toaster />
      {/* Solo mostrar Header y Footer si está autenticado */}
      {isAuthenticated && <Header/>}

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
                <Route path="/PlanificacionEquipos" element={<PlanificacionEquipos />} />
                <Route path="/VistaAdministrador" element={<VistaAdministrador />} />
              </>
            )}
            {role === 'estudiante' && (
              <>
                <Route path="/VistaEstudiante" element={<VistaEstudiantes />} />
                <Route path="/Planificacion" element={<Planificacion />} />
                <Route path="/Equipos" element={<Equipos />} />
              </>
            )}
            {role === 'docente' && (
              <>
                <Route path="/VistaDocente" element={<VistaDocentes />} />
                <Route path="/Estudiantes" element={<Estudiantes />} />
              </>
            )}
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        )}
      </div>

      {/* Solo mostrar Footer si está autenticado */}
      {isAuthenticated && <Footer />}
      <Header />
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/Planificacion" element={<Planificacion />} />
        <Route path="/Docentes" element={<Docentes />} />
        <Route path="/Estudiantes" element={<Estudiantes />} />
        <Route path="/Equipos" element={<Equipos />} />
        <Route path="/Seguimiento" element={<Seguimiento />} />
        <Route path="/PlanillasSemanales" element={<PlanillasSemanales />} />
        <Route path="/TareasEstudiante" element={<TareasEstudiante />} />
        <Route path="/GenerarPlanilla" element={<GenerarPlanilla />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;