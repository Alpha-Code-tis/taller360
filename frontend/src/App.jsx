// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Docentes from './Administrador/Docentes';
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
