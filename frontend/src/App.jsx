import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Footer from './Componentes/Footer';
import Header from './Componentes/Header';
import './App.css';

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
      <Toaster />
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
    </div>
  );
}

export default App;
