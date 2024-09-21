// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Docentes from './Representante_legal/Docentes';
import Planificacion from './Representante_legal/Planificacion';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/Planificacion" element={<Planificacion/>}/>
        <Route path="/Docentes" element={<Docentes />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
