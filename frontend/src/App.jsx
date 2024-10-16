
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
import Autoevaluacion from './Autoevaluacion/Autoevaluacion';
import ListaAutoevaluacion from './Autoevaluacion/ListaAutoevaluacion';
import './App.css';


function App() {
  return (
    <div>
      <Header />
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/Planificacion" element={<Planificacion/>}/>
       <Route path="/Docentes" element={<Docentes />} /> 
        <Route path="/Estudiantes" element={<Estudiantes />} />
        <Route path="/Equipos" element={<Equipos />} />
        <Route path="/Autoevaluacion" element={<Autoevaluacion />} />
        <Route path="/ListaAutoevaluacion" element={<ListaAutoevaluacion />} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;
