import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import './CriterioEvaluacion.css';

const CriterioEvaluacion = () => {
  const [criterio, setCriterio] = useState([]);
  const [filteredCriterios, setFilteredCriterios] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCriterio, setCurrentCriterio] = useState(null);
  const [formValues, setFormValues] = useState({
    id: '',
    nombre: '',
    descripción: '',
    porcentaje: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleShowModal = () => {
    setFormValues({
      id: '',
      nombre: '',
      descripción: '',
      porcentaje: '',
    });
    setShowModal(true);
  };

  const handleCloseModal =()=>{

  };

  return (
    <div className="container mt-2 pt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="m-0">Criterios de Evaluación</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={() => handleShowModal()}>+ Registrar Criterio</button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}
      <div className="table-container">
        <table className="table table-hover estudiantes-table">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descipcion</th>
              <th>Porcentaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCriterios.map((criterio) => (
              <tr key={criterio.id_criterio}>
                <td>{criterio.nombre}</td>
                <td>{criterio.descripcion}</td>
                <td>{criterio.porcentaje}</td>

                <td>
                  <button className="icon-button" title="Editar" onClick={() => handleShowModal(criterio)}>
                    <FaEdit />
                  </button>
                  <button className="icon-button" title="Eliminar" onClick={() => handleDelete(criterio.id_criterio)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CriterioEvaluacion;
