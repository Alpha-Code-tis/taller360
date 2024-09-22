
import { useState } from 'react'
// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import { Toaster } from 'react-hot-toast';
import Planificacion from './Representante_legal/Planificacion';

import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';

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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
