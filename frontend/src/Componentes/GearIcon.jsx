// src/Componentes/GearIcon.jsx
import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './GearIcon.css';

const GearIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [teamConfigModalShow, setTeamConfigModalShow] = useState(false);
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    if (option === 'Habilitar Vistas') {
      setModalShow(true);
    } else if (option === 'Configuración de Equipos') {
      setTeamConfigModalShow(true);
    }
    setIsOpen(false);
  };

  const handleSaveChanges = () => {
    // Lógica para guardar cambios en "Habilitar Vistas"
    console.log('Guardando cambios de habilitación de vistas');
    setModalShow(false);
  };

  const handleTeamConfigSave = () => {
    // Lógica para guardar cambios en "Configuración de Equipos"
    console.log('Guardando cambios de configuración de equipos');
    setTeamConfigModalShow(false);
  };

  return (
    <div className="gear-icon" onClick={toggleMenu} style={{ position: 'relative', cursor: 'pointer' }}>
      <FaCog size={30} />
      {isOpen && (
        <div className="gear-menu">
          <ul>
            <li onClick={() => handleOptionClick('Habilitar Vistas')}>Habilitar Vistas</li>
            <li onClick={() => handleOptionClick('Configuración de Equipos')}>Configuración de Equipos</li>
          </ul>
        </div>
      )}

      {/* Modal Habilitar Vistas */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Habilitar vistas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><strong>Autoevaluación</strong></Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Label>Fecha Inicio
                  <Form.Control type="date" value={autoEvalStart} onChange={(e) => setAutoEvalStart(e.target.value)} />
                </Form.Label>
                <Form.Label>Fecha Fin
                  <Form.Control type="date" value={autoEvalEnd} onChange={(e) => setAutoEvalEnd(e.target.value)} />
                </Form.Label>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><strong>Evaluación Final</strong></Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Label>Fecha Inicio
                  <Form.Control type="date" value={finalEvalStart} onChange={(e) => setFinalEvalStart(e.target.value)} />
                </Form.Label>
                <Form.Label>Fecha Fin
                  <Form.Control type="date" value={finalEvalEnd} onChange={(e) => setFinalEvalEnd(e.target.value)} />
                </Form.Label>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Configuración de Equipos */}
      <Modal show={teamConfigModalShow} onHide={() => setTeamConfigModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Configuración de Equipos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Gestión</Form.Label>
              <Form.Control type="text" placeholder="2-2024" />
            </Form.Group>
            
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupStartDate">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control type="text" placeholder="dd/mm/aaaa" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupEndDate">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control type="text" placeholder="dd/mm/aaaa" />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupMinStudents">
                  <Form.Label>Cantidad Min. de estudiantes</Form.Label>
                  <Form.Control type="text" placeholder="3" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupMaxStudents">
                  <Form.Label>Cantidad Max. de estudiantes</Form.Label>
                  <Form.Control type="text" placeholder="6" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTeamConfigModalShow(false)}>Cerrar</Button>
          <Button variant="primary" onClick={handleTeamConfigSave}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GearIcon;
