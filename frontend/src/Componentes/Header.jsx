import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.jpeg';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups'; // Nuevo icono para Equipos
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import SettingsIcon from '@mui/icons-material/Settings';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const VistaAdministrador = () => {
  const navigate = useNavigate(); // Hook para navegación
}

const handleButtonClick = (button) => {
  // Maneja la lógica adicional que necesites al hacer clic
  console.log(`Button clicked: ${button}`);
};

const selectedButton = 'docentes'; // Asegúrate de gestionar el estado seleccionado correctamente

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(''); // Estado para el rol
  const [nombre, setNombre] = useState(''); // Estado para el rol
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const navigate = useNavigate(); // Para redireccionar
  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [notaPares, setNotaPares] = useState('');

  useEffect(() => {
    // Obtener el role del localStorage al montar el componente
    const storedRole = localStorage.getItem('role');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRole) {
      setRole(storedRole);
      setNombre(storedNombre);
    }
    fetchFechas();
  }, []); // Se ejecuta solo una vez al montar el componente

  const fetchFechas = async () => {
    try {
      const response = await axios.get(`${API_URL}ajustes`);
      const data = response.data;

      setFinalEvalStart(data.fecha_inicio_eva_final ?? '');
      setFinalEvalEnd(data.fecha_fin_eva_final ?? '');
      setAutoEvalStart(data.fecha_inicio_autoevaluacion ?? '');
      setAutoEvalEnd(data.fecha_fin_autoevaluacion ?? '');
      setNotaPares(data.nota_pares ?? '');
    } catch (error) {
      toast.error('No se recuperaron los datos.');
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget); // Abre el menú al hacer clic en el ícono
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Cierra el menú
  };

  const handleLogout = () => {
    // Eliminar datos del localStorage (token, rol, etc.)
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    // Redireccionar al login
    navigate('/login');
    window.location.reload();
  };
  const [teamConfigModalShow, setTeamConfigModalShow] = useState(false);
  const handleTeamConfigSave = () => {
    // Lógica para guardar los ajustes de conformación de equipos
    setTeamConfigModalShow(false);
    toast.success('Ajustes de conformación de equipos guardados');
  };
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);

  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  const [formGroupName, setFormGroupName] = useState('');
  const [formGroupStartDate, setformGroupStartDate] = useState('');
  const [formGroupEndDate, setformGroupEndDate] = useState('');
  const [formGroupMinStudents, setformGroupMinStudents] = useState('');
  const [formGroupMaxStudents, setformGroupMaxStudents] = useState('');

  const handleSaveChanges = async () => {
    const payload = {
      fecha_inicio_autoevaluacion: autoEvalStart,
      fecha_fin_autoevaluacion: autoEvalEnd,
      fecha_inicio_eva_final: finalEvalStart,
      fecha_fin_eva_final: finalEvalEnd,
      nota_pares: notaPares,
    };

    try {
      await axios.patch(`${API_URL}ajustes`, payload);
      toast.success('Fechas guardadas correctamente');
      setModalShow(false);
    } catch (error) {
      toast.error('Error al guardar las fechas');
    }
  };

  const handleSaveChangesGrup = async () => {
    const payload = {
      gestion: formGroupName,
      fecha_inicio: formGroupStartDate,
      fecha_fin: formGroupEndDate,
      cantidad_minima: formGroupMinStudents,
      cantidad_maxima: formGroupMaxStudents,
    };
    console.log(payload);
    try {
      await axios.post(`${API_URL}gestion`, payload);
      toast.success('Fechas guardadas correctamente');
      setModalShow(false);
    } catch (error) {
      // Mostrar el mensaje de error en la interfaz
      toast.error('Error al guardar las fechas');

      // Mostrar el error completo en la consola para mayor detalle
      console.error('Error al guardar las fechas:', error);

      // Si la respuesta del servidor contiene un mensaje específico, también puedes mostrarlo
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      } else if (error.request) {
        console.error('Sin respuesta del servidor. Solicitud realizada:', error.request);
      } else {
        console.error('Error de configuración:', error.message);
      }
    }

  };
  const [selectedButton, setSelectedButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
          sx={{
            backgroundColor: '#FFFFFF',
            color: 'black',
          }}
        >
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <div className="ms-auto d-flex align-items-center">
            {role === 'docente' && (
              <IconButton color="primary" onClick={handleSettingsMenuOpen} className="me-3">
                <SettingsIcon />
              </IconButton>
            )}
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">{nombre}</span>
            <IconButton onClick={handleMenuOpen}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu anchorEl={settingsMenuAnchor} open={Boolean(settingsMenuAnchor)} onClose={handleSettingsMenuClose}>
              <MenuItem onClick={() => { setModalShow(true); handleSettingsMenuClose(); }}>Habilitar vistas</MenuItem>
              <MenuItem onClick={() => { setTeamConfigModalShow(true); handleSettingsMenuClose(); }}>Conformación de Equipos</MenuItem>
            </Menu>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#2D5981',
            color: 'white',
            paddingTop: '30px',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <div className="d-flex flex-column align-items-center">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle"
            style={{ width: '100px', height: '100px' }}
          />
        </div>
        <Divider />

        <List sx={{ mt: 3 }}>
          {/* Estudiante */}
          {role === 'estudiante' && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Planificacion"
                  onClick={() => handleButtonClick('planificacion')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'planificacion' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <NoteAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Planificación" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              {/* Equipos */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Equipos"
                  onClick={() => handleButtonClick('equipos')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'equipos' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <GroupsIcon /> {/* Aquí cambiamos a GroupsIcon */}
                  </ListItemIcon>
                  <ListItemText primary="Equipos" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>



              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/TareasEstudiante"
                  onClick={() => handleButtonClick('tareasEstudiante')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'tareasEstudiante' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tareas Estudiante" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Seguimiento"
                  onClick={() => handleButtonClick('seguimiento')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'seguimiento' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText primary="Seguimiento" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              {/* Autoevaluacion */}
              {dayjs().isSameOrAfter(dayjs(autoEvalStart), 'day') && dayjs().isSameOrBefore(dayjs(autoEvalEnd), 'day') && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/Autoevaluacion"
                    onClick={() => handleButtonClick('autoevaluacion')}
                    sx={{
                      borderRadius: '8px',
                      backgroundColor: selectedButton === 'autoevaluacion' ? '#1A3254' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#1A3254',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'white' }}>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary="Autoevaluación" sx={{ color: 'white' }} />
                  </ListItemButton>
                </ListItem>
              )}

              {/* EvaluacionPares */}
              {dayjs().isSameOrAfter(dayjs(finalEvalStart), 'day') && dayjs().isSameOrBefore(dayjs(finalEvalEnd), 'day') && (
                <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/EvaluacionPares"
                  onClick={() => handleButtonClick('evaluacionPares')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'evaluacionPares' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FactCheckIcon />
                  </ListItemIcon>
                  <ListItemText primary="Evaluación Pares" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
              )}

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/PlanillasSemanales" // Agregamos la ruta de las planillas
                  onClick={() => handleButtonClick('planillas')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'planillas' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <CalendarMonthIcon />
                  </ListItemIcon>
                  <ListItemText primary="Planillas Semanales" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {/* Administrador */}
          {role === 'administrador' && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Docentes"
                  onClick={() => handleButtonClick('docentes')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'docentes' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FactCheckIcon />
                  </ListItemIcon>
                  <ListItemText primary="Docentes" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            </>

          )}

          {/* docente */}
          {role === 'docente' && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/PlanificacionEquipos"
                  onClick={() => handleButtonClick('planificacionEquipos')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'planificacionEquipos' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <NoteAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Planificacion de equipos" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Estudiantes"
                  onClick={() => handleButtonClick('estudiantes')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'estudiantes' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Estudiantes" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/GenerarPlanilla"
                  onClick={() => handleButtonClick('generarPlanilla')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'generarPlanilla' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <PictureAsPdfIcon />
                  </ListItemIcon>
                  <ListItemText primary="Generar Planilla PDF" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/ListaAutoevaluacion"
                  onClick={() => handleButtonClick('listaAutoevaluacion')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'listaAutoevaluacion' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary="ListaAutoevaluacion" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/CriterioEvaluacion"
                  onClick={() => handleButtonClick('criterioEvaluacion')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'criterioEvaluacion' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <ChecklistIcon />
                  </ListItemIcon>
                  <ListItemText primary="Criterios de Evaluación" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/EvaluationForm"
                  onClick={() => handleButtonClick('EvaluationForm')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'EvaluationForm' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AssignmentTurnedInIcon />
                  </ListItemIcon>
                  <ListItemText primary="Formulario de Evaluacion" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/ReportePorEvaluaciones"
              onClick={() => handleButtonClick('ReportePorEvaluaciones')}
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'evaluationForm' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Reporte por Evaluaciones" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

              {/* Modal Conformación de Equipos */}
              <Modal show={teamConfigModalShow} onHide={() => setTeamConfigModalShow(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Conformación de Equipos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formGroupName">
                      <Form.Label>Gestion</Form.Label>
                      <Form.Control type="text" placeholder="2-2024" value={formGroupName} // Vincula el valor con el estado
                        onChange={(e) => setFormGroupName(e.target.value)} // Actualiza el estado al cambiar el texto
                      />
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupStartDate">
                          <Form.Label>Fecha Inicio</Form.Label>
                          <Form.Control type="text" placeholder="dd/mm/aaaa" value={formGroupStartDate} // Vincula el valor con el estado
                            onChange={(e) => setformGroupStartDate(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupEndDate">
                          <Form.Label>Fecha Fin</Form.Label>
                          <Form.Control type="text" placeholder="dd/mm/aaaa" value={formGroupEndDate} // Vincula el valor con el estado
                            onChange={(e) => setformGroupEndDate(e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupMinStudents">
                          <Form.Label>Cantidad Min. de estudiantes</Form.Label>
                          <Form.Control type="text" placeholder="3" value={formGroupMinStudents} // Vincula el valor con el estado
                            onChange={(e) => setformGroupMinStudents(e.target.value)} />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupMaxStudents">
                          <Form.Label>Cantidad Max. de estudiantes</Form.Label>
                          <Form.Control type="text" placeholder="6" value={formGroupMaxStudents} // Vincula el valor con el estado
                            onChange={(e) => setformGroupMaxStudents(e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setTeamConfigModalShow(false)}>Cerrar</Button>
                  <Button variant="primary" onClick={handleSaveChangesGrup}>Guardar cambios</Button>
                </Modal.Footer>
              </Modal>
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
                      <Form.Label><strong>Evaluación Pares</strong></Form.Label>
                      <div className="d-flex justify-content-between">
                        <Form.Label>Fecha Inicio
                          <Form.Control type="date" value={finalEvalStart} onChange={(e) => setFinalEvalStart(e.target.value)} />
                        </Form.Label>
                        <Form.Label>Fecha Fin
                          <Form.Control type="date" value={finalEvalEnd} onChange={(e) => setFinalEvalEnd(e.target.value)} />
                        </Form.Label>
                      </div>
                      {/* Nota Pares */}
                      <div>
                        <Form.Label>Nota Pares</Form.Label>
                        <Form.Control
                          type="number"
                          value={notaPares}
                          onChange={(e) => setNotaPares(e.target.value)}
                          placeholder="Ingrese nota"
                          min={0}
                          max={100}
                        />
                      </div>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setModalShow(false)}>Cerrar</Button>
                  <Button variant="primary" onClick={handleSaveChanges}>Guardar cambios</Button>
                </Modal.Footer>
              </Modal>

            </>
          )}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
    </Box>
  );
}
