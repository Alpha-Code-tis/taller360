import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Spinner, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';
import './EvaluacionEntreEquipos.css';

const EvaluacionEntreEquipos = () => {
    const [equipos, setEquipos] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [equipoEvaluador, setEquipoEvaluador] = useState(null);
    const [equipoEvaluado, setEquipoEvaluado] = useState(null);
    const [equiposDisponibles, setEquiposDisponibles] = useState([]); // Estado para equipos evaluados disponibles
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

    const gestionActual = '2-2024';

    // Obtener equipos al cargar el componente
    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const response = await axios.get(`${API_URL}equipos`, {
                    params: { gestion: gestionActual },
                });
                setEquipos(response.data);
                setEquiposDisponibles(response.data); // Inicialmente, todos los equipos están disponibles
            } catch (error) {
                console.error('Error al cargar los equipos:', error.response?.data || error.message);
                toast.error('Error al cargar los equipos de la gestión actual');
            }
        };

        fetchEquipos();
    }, []);

    // Obtener asignaciones al cargar el componente
    useEffect(() => {
        const fetchAsignaciones = async () => {
            try {
                const response = await axios.get(`${API_URL}cruzada`, {
                    params: { gestion: gestionActual },
                });
                setAsignaciones(response.data);
            } catch (error) {
                console.error('Error al cargar las asignaciones:', error.response?.data || error.message);
                toast.error('Error al cargar las asignaciones');
            }
        };

        fetchAsignaciones();
    }, []);

    // Actualizar lista de equipos evaluados disponibles cuando cambie el evaluador
    useEffect(() => {
        const actualizarEquiposDisponibles = () => {
            if (!equipoEvaluador) {
                setEquiposDisponibles(equipos); // Si no hay evaluador seleccionado, todos los equipos están disponibles
                return;
            }

            const asignados = asignaciones
                .filter((asignacion) => asignacion.equipo_evaluador_id === equipoEvaluador) // Solo asignaciones de este evaluador
                .map((asignacion) => asignacion.equipo_evaluado_id);

            setEquiposDisponibles(
                equipos.filter((equipo) => !asignados.includes(equipo.id_empresa)) // Filtrar equipos ya evaluados
            );
        };

        actualizarEquiposDisponibles();
    }, [equipoEvaluador, asignaciones, equipos]); // Ejecutar cada vez que cambie el evaluador, asignaciones o equipos

    // Guardar asignación de equipos
    const handleAsignarEvaluacion = async () => {
        if (!equipoEvaluador || !equipoEvaluado) {
            toast.error('Debes seleccionar ambos equipos para asignar la evaluación');
            return;
        }

        if (equipoEvaluador === equipoEvaluado) {
            toast.error('Un equipo no puede evaluarse a sí mismo');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}cruzada`, {
                equipo_evaluador_id: equipoEvaluador,
                equipo_evaluado_id: equipoEvaluado,
                gestion: gestionActual,
            });

            toast.success('Evaluación asignada correctamente');
            setAsignaciones((prev) => [
                ...prev,
                response.data, // Agrega la nueva asignación desde la respuesta del backend
            ]);
            setEquipoEvaluado(null); // Reinicia la selección del equipo evaluado
        } catch (error) {
            console.error('Error al asignar la evaluación:', error.response?.data || error.message);
            toast.error('Error al asignar la evaluación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="evaluacion-entre-equipos-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Equipos de la Gestión {gestionActual}</h2>
                <Button variant="secondary" onClick={() => setShowModal(true)}>
                    Ver Asignaciones
                </Button>
            </div>

            {/* Modal para mostrar asignaciones */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Asignaciones Realizadas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {asignaciones.length > 0 ? (
                        <ul>
                            {asignaciones.map((asignacion, index) => (
                                <li key={index}>
                                    <strong>Evaluador:</strong>{' '}
                                    {equipos.find((e) => e.id_empresa === asignacion.equipo_evaluador_id)?.nombre_empresa}{' '}
                                    → <strong>Evaluado:</strong>{' '}
                                    {equipos.find((e) => e.id_empresa === asignacion.equipo_evaluado_id)?.nombre_empresa}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay asignaciones registradas.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Seleccionar Equipos */}
            <Form.Group controlId="equipoEvaluadorSelect">
                <Form.Label>Selecciona el Equipo Evaluador:</Form.Label>
                <Form.Control
                    as="select"
                    value={equipoEvaluador || ''}
                    onChange={(e) => setEquipoEvaluador(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Selecciona un equipo evaluador
                    </option>
                    {equipos.map((equipo) => (
                        <option key={equipo.id_empresa} value={equipo.id_empresa}>
                            {equipo.nombre_empresa}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="equipoEvaluadoSelect">
                <Form.Label>Selecciona el Equipo Evaluado:</Form.Label>
                <Form.Control
                    as="select"
                    value={equipoEvaluado || ''}
                    onChange={(e) => setEquipoEvaluado(Number(e.target.value))}
                >
                    <option value="" disabled>
                        Selecciona un equipo evaluado
                    </option>
                    {equiposDisponibles.map((equipo) => (
                        <option key={equipo.id_empresa} value={equipo.id_empresa}>
                            {equipo.nombre_empresa}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Button
                variant="primary"
                onClick={handleAsignarEvaluacion}
                disabled={loading}
            >
                {loading ? <Spinner animation="border" size="sm" /> : 'Asignar Evaluación'}
            </Button>
        </div>
    );
};

export default EvaluacionEntreEquipos;
