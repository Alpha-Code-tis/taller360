
import { useState } from 'react'
// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Docentes from './Representante_legal/Docentes';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/Docentes" element={<Docentes />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
