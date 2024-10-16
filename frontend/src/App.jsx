import { useState } from 'react'
// src/App.jsx
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { Toaster } from 'react-hot-toast';
import Planificacion from './Representante_legal/Planificacion';

import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import PlanillasSemanales from './Planillas/GenerarPlanilla';
import './App.css';
import Seguimiento from './Representante_legal/Seguimiento';
import TareasEstudiante from './Estudiantes/TareasEstudiante'; // Asegúrate de que esta sea la ruta correcta
import GenerarPlanilla from './Administrador/GenerarPlanilla';


function App() {
  return (
    <div>
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