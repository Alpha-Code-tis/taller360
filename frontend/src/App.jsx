// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Docentes from './Administrador/Docentes';
import Estudiantes from './Estudiantes/Estudiantes';
import Equipos from './Equipos/Equipos';
import './App.css';


function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/Docentes" element={<Docentes />} />
        <Route path="/Estudiantes" element={<Estudiantes />} />
        <Route path="/Equipos" element={<Equipos />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
