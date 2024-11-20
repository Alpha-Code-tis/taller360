import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// src/App.jsx
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import VistaDocentes from './Componentes/VistaDocente';
import VistaEstudiantes from './Componentes/VistaEstudiante';
import VistaAdministrador from './Componentes/VistaAdministrador';
import PlanificacionEquipos from './Estudiantes/PlanificacionEquipos';
import Login from './Componentes/Login';
import { Toaster } from 'react-hot-toast';
import Planificacion from './Representante_legal/Planificacion';
import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import Autoevaluacion from './Autoevaluacion/Autoevaluacion';
import ListaAutoevaluacion from './Autoevaluacion/ListaAutoevaluacion';
import EvaluacionPares from './EvaluacionPares/EvaluacionPares';
import Footer from './Componentes/Footer';
import Header from './Componentes/Header';
import './App.css';
import Cruzada from './Evaluaciones/Cruzada';
import Evaluaciones from './Evaluaciones/Cruzada';
import axios from 'axios';
import PlanillasSemanales from './Planillas/GenerarPlanilla';
import './App.css';
import Seguimiento from './Representante_legal/Seguimiento';
import TareasEstudiante from './Estudiantes/TareasEstudiante'; // Asegúrate de que esta sea la ruta correcta
import CriterioEvaluacion from './CriteriosEvaluacion/CriterioEvaluacion';
import EvaluationForm from './EvaluationForm/EvaluationForm';
import PlanillaNotas from './PlanillaNotas/PlanillaNotas';
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
      navigate('/login');
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
                <Route path="/VistaAdministrador" element={<VistaAdministrador />} />
              </>
            )}
            {role === 'estudiante' && (
              <>
                <Route path="/VistaEstudiante" element={<VistaEstudiantes />} />
                <Route path="/Planificacion" element={<Planificacion />} />
                <Route path="/Equipos" element={<Equipos />} />
                
                <Route path="/TareasEstudiante" element={<TareasEstudiante />} />
                <Route path="/Seguimiento" element={<Seguimiento />} />
                <Route path="/Evaluaciones" element={<Evaluaciones />} />
                <Route path="/Cruzada" element={<Cruzada />} />
                <Route path="/Estudiantes" element={<Estudiantes />} />
                <Route path="/Autoevaluacion" element={<Autoevaluacion />} />
                <Route path="/EvaluacionPares" element={<EvaluacionPares />} />
              </>
            )}
            {role === 'docente' && (
              <>
                <Route path="/VistaDocente" element={<VistaDocentes />} />
                <Route path="/PlanificacionEquipos" element={<PlanificacionEquipos />} />
                <Route path="/Estudiantes" element={<Estudiantes />} />
                <Route path="/ListaAutoevaluacion" element={<ListaAutoevaluacion />} />
                <Route path="/CriterioEvaluacion" element={<CriterioEvaluacion />} />
                <Route path="/EvaluationForm" element={<EvaluationForm />} />
                <Route path="/PlanillasSemanales" element={<PlanillasSemanales />} />
                <Route path="/PlanillaNotas" element={<PlanillaNotas />} />
              </>
            )}
            {/* <Route path="/Seguimiento" element={<Seguimiento />} />
            
            <Route path="/TareasEstudiante" element={<TareasEstudiante />} />
            <Route path="/GenerarPlanilla" element={<GenerarPlanilla />} /> */}
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </Routes>
        )}
      </div>
      {isAuthenticated && role === 'docente'}
      {/* Solo mostrar Footer si está autenticado */}
      {isAuthenticated && <Footer />}
    </div>
  );
}
export default App;
