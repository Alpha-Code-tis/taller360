import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import './ReportePorEvaluaciones.css';
import { PDFViewer } from '@react-pdf/renderer';
import Report from "./Reporte";

const ReportePorEvaluaciones = () => {
  const [empresas, setEmpresas] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState('');
  const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [showPdf, setShowPdf] = useState(false);
  const [pdfData, setPdfData] = useState({
    evaluation: '',
    empresa: '',
    sprint: '',
    title: '',
    headers: [],
    rows: []
  });

  const evaluations = [
    { id: 1, label: 'Autoevaluación' },
    { id: 2, label: 'Evaluación entre pares' },
    // { id: 3, label: 'Evaluación cruzada' }
  ];

  useEffect(() => {
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (selectedEmpresaId) {
      setSelectedSprintId('');
      fetchSprintByEmpresa();
    }
  }, [selectedEmpresaId]);

  useEffect(() => {
    if (selectedEvaluationId && selectedEmpresaId && selectedSprintId) {
      if (Number(selectedEvaluationId) === evaluations[0].id) {
        fetchReportAutoevaluacion();
      } else if (Number(selectedEvaluationId) === evaluations[1].id) {
        fetchReportEvaPares();
      }
      setShowPdf(true);
    } else {
      setShowPdf(false);
    }
  }, [selectedEvaluationId, selectedSprintId]);

  const fetchEmpresas = async() => {
    try {
      const response = await axios.get(`${API_URL}equipos`);
      setEmpresas(response.data);
    } catch (error) {
      toast.error('Error al cargar las empresas.');
    }
  };

  const fetchSprintByEmpresa = async() => {
    try {
      const response = await axios.get(`${API_URL}listar-sprints?empresaId=${selectedEmpresaId}`);
      setSprints(response.data);
    } catch (error) {
      toast.error('Error al cargar los sprints por empresa.');
    }
  };

  const fetchReportAutoevaluacion = async() => {
    try {
      const response = await axios.get(`${API_URL}reportes/autoevaluacion?empresaId=${selectedEmpresaId}&sprintId=${selectedSprintId}`);
      const rows = response.data.map(item => ([
        `${item.ap_pat} ${item.ap_mat} ${item.nombre_estudiante}`,
        item.tareas.reduce((acc, item) => `${acc}• ${item.nombre_tarea}\n`, ''),
        item.tareas.reduce((acc, item) => `${acc}• ${item.estado}\n`, ''),
        item.tareas.reduce((acc, item) => `${acc}• ${item.pivot.resultado_evaluacion}${item.pivot.descripcion_evaluacion ? ' - ' + item.pivot.descripcion_evaluacion : ''}\n`, '')
      ]));
      const pdfData = {
        title: `Reporte ${evaluations[0].label}`,
        evaluation: evaluations.find(e => e.id === Number(selectedEvaluationId)).label,
        empresa: empresas.find(e => e.id_empresa === Number(selectedEmpresaId)).nombre_empresa,
        sprint: `${sprints.find(s => s.id_sprint === Number(selectedSprintId)).nro_sprint}`,
        headers: ['Nombre del Estudiante', 'Tareas Realizadas', 'Estado de las Tareas', 'Detalles de la Autoevaluación'],
        rows
      };
      setPdfData(pdfData);
    } catch (error) {
      toast.error('Error al cargar los datos para reporte autoevaluación.');
    }
  };

  const fetchReportEvaPares = async() => {
    try {
      const response = await axios.get(`${API_URL}reportes/evaluacionPares?empresaId=${selectedEmpresaId}&sprintId=${selectedSprintId}`);
      const rows = response.data.map(item => ([
        `${item.ap_pat} ${item.ap_mat} ${item.nombre_estudiante}`,
        item.evaluado_criterios.reduce((acc, item) => `${acc}• ${item.nombre}\n`, ''),
        item.evaluado_criterios.reduce((acc, item) => `${acc}• ${item.descripcion}\n`, ''),
        item.evaluado_criterios.reduce((acc, item) => `${acc}• ${item.porcentaje}\n`, ''),
        item.evaluado_criterios.reduce((acc, item) => `${acc}• ${item.estudiante_evaluador.ap_pat} ${item.estudiante_evaluador.ap_mat} ${item.estudiante_evaluador.nombre_estudiante}\n`, '')
      ]));
      const pdfData = {
        title: `Reporte ${evaluations[1].label}`,
        evaluation: evaluations.find(e => e.id === Number(selectedEvaluationId)).label,
        empresa: empresas.find(e => e.id_empresa === Number(selectedEmpresaId)).nombre_empresa,
        sprint: `${sprints.find(s => s.id_sprint === Number(selectedSprintId)).nro_sprint}`,
        headers: ['Nombre del Estudiante', 'Nombre criterio', 'Descripción Criterio', 'Porcentaje', 'Estudiante Evaluador'],
        rows
      };
      setPdfData(pdfData);
    } catch (error) {
      toast.error('Error al cargar los datos para reporte Evaluación entre pares.');
    }
  };

  const handleEvaluationChange = (event) => {
    setSelectedEvaluationId(event.target.value);
  };

  const handleEmpresaChange = (event) => {
    setSelectedEmpresaId(event.target.value);
  };

  const handleSprintChange = (event) => {
    setSelectedSprintId(event.target.value);
  };


  return (
    <div className="container mt-2 pt-3">
      <h1 className="report-title">Reporte por Evaluaciones</h1>
      <div className="select-container">
        <div className="select-item">
          <label>Evaluación:</label>
          <Form.Select aria-label="Seleccionar evaluación" onChange={handleEvaluationChange} defaultValue="">
            <option disabled value="">Seleccionar evaluación</option>
            {evaluations.map(evaluation => (
              <option value={evaluation.id} key={evaluation.id}>{evaluation.label}</option>
            ))}
          </Form.Select>
        </div>
        <div className="select-item">
          <label>Empresa:</label>
          <Form.Select aria-label="Seleccionar empresa" onChange={handleEmpresaChange} defaultValue="">
            <option disabled value="">Seleccionar empresa</option>
            {empresas.map(empresa => (
              <option value={empresa.id_empresa} key={empresa.id_empresa}>{empresa.nombre_empresa}</option>
            ))}
          </Form.Select>
        </div>
        <div className="select-item">
          <label>Sprint:</label>
          <Form.Select aria-label="Seleccionar sprint" onChange={handleSprintChange} value={selectedSprintId}>
            <option disabled value="">Seleccionar sprint</option>
            {sprints.map(sprint => (
              <option value={sprint.id_sprint} key={sprint.id_sprint}>Sprint {sprint.nro_sprint}</option>
            ))}
          </Form.Select>
        </div>
      </div>
      {showPdf && (
        <div className='mt-3 pdf-container'>
          <PDFViewer width="130%" height="800">
            <Report data={pdfData}/>
          </PDFViewer>
        </div>
      )}
    </div>
  );
};

export default ReportePorEvaluaciones;
