import React, { useState, useEffect } from 'react';
import {
  styled,
  useTheme,
  Box,
  Drawer,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  Checklist as ChecklistIcon,
  Group as GroupIcon,
  NoteAlt as NoteAltIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  CalendarMonth as CalendarMonthIcon,
} from '@mui/icons-material';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.jpeg';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      marginLeft: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState('');
  const [nombre, setNombre] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  // Estados para Modals y fechas
  const [modalShow, setModalShow] = useState(false);
  const [teamConfigModalShow, setTeamConfigModalShow] = useState(false);
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');
  const [cruzadaStart, setCruzadaStart] = useState('');
  const [cruzadaEnd, setCruzadaEnd] = useState('');
  const [notaPares, setNotaPares] = useState('');

  // Estados para Conformación de Equipos
  const [formGroupName, setFormGroupName] = useState('');
  const [formGroupStartDate, setFormGroupStartDate] = useState('');
  const [formGroupEndDate, setFormGroupEndDate] = useState('');
  const [formGroupMinStudents, setFormGroupMinStudents] = useState('');
  const [formGroupMaxStudents, setFormGroupMaxStudents] = useState('');

  useEffect(() => {
    // Obtener el rol y nombre del localStorage al montar el componente
    const storedRole = localStorage.getItem('role');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRole) {
      setRole(storedRole);
      setNombre(storedNombre);
    }
    fetchFechas();
  }, []);

  const fetchFechas = async () => {
    try {
      const response = await axios.get(`${API_URL}ajustes`);
      const data = response.data;

      setFinalEvalStart(data.fecha_inicio_eva_final ?? '');
      setFinalEvalEnd(data.fecha_fin_eva_final ?? '');
      setAutoEvalStart(data.fecha_inicio_autoevaluacion ?? '');
      setAutoEvalEnd(data.fecha_fin_autoevaluacion ?? '');
      setCruzadaStart(data.fecha_inicio_eva_cruzada ?? '');
      setCruzadaEnd(data.fecha_fin_eva_cruzada ?? '');
      setNotaPares(data.nota_pares ?? '');
    } catch (error) {
      toast.error('No se recuperaron los datos.');
    }
  };

  // Manejo de menús y sesiones
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    navigate('/login');
    window.location.reload();
  };

  // Manejo del drawer y botones
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  // Manejo de guardado de cambios
  const handleSaveChanges = async () => {
    const payload = {
      fecha_inicio_autoevaluacion: autoEvalStart,
      fecha_fin_autoevaluacion: autoEvalEnd,
      fecha_inicio_eva_cruzada: cruzadaStart,
      fecha_fin_eva_cruzada: cruzadaEnd,
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
    try {
      await axios.post(`${API_URL}gestion`, payload);
      toast.success('Ajustes de conformación de equipos guardados');
      setTeamConfigModalShow(false);
    } catch (error) {
      toast.error('Error al guardar las fechas');
      console.error('Error al guardar las fechas:', error);
    }
  };

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
            <IconButton color="primary" onClick={handleSettingsMenuOpen} className="me-3">
              <SettingsIcon />
            </IconButton>
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">{nombre}</span>
            <IconButton onClick={handleMenuOpen}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={settingsMenuAnchor}
              open={Boolean(settingsMenuAnchor)}
              onClose={handleSettingsMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setModalShow(true);
                  handleSettingsMenuClose();
                }}
              >
                Habilitar vistas
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setTeamConfigModalShow(true);
                  handleSettingsMenuClose();
                }}
              >
                Conformación de Equipos
              </MenuItem>
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
          {/* Vista docente */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanificacionEquipos"
              onClick={() => handleButtonClick('planificacionEquipos')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'planificacionEquipos' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Planificación de Equipos" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Estudiantes */}
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

          {/* Lista Autoevaluación */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/ListaAutoevaluacion"
              onClick={() => handleButtonClick('listaAutoevaluacion')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'listaAutoevaluacion' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Lista Autoevaluación" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Criterios de Evaluación */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/CriterioEvaluacion"
              onClick={() => handleButtonClick('criterioEvaluacion')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'criterioEvaluacion' ? '#1A3254' : 'transparent',
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

          {/* Formulario de Evaluación */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/EvaluationForm"
              onClick={() => handleButtonClick('EvaluationForm')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'EvaluationForm' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Formulario de Evaluación" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Reportes */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/Reportes"
              onClick={() => handleButtonClick('reportes')}
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'reportes' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Reportes" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Planillas Semanales */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanillasSemanales"
              onClick={() => handleButtonClick('planillasSemanales')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'planillasSemanales' ? '#1A3254' : 'transparent',
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

          {/* Evaluación Entre Equipos */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/EvaluacionEntreEquipos"
              onClick={() => handleButtonClick('EvaluacionEntreEquipos')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'EvaluacionEntreEquipos' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Evaluación Entre Equipos" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Planilla de Notas */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanillaNotas"
              onClick={() => handleButtonClick('planillaNotas')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'planillaNotas' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Planilla de Notas" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>

          {/* Planilla de Notas Final */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanillaNotasFinal"
              onClick={() => handleButtonClick('planillaNotasFinal')}
              sx={{
                borderRadius: '8px',
                backgroundColor:
                  selectedButton === 'planillaNotasFinal' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary="Planilla de Notas Final" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
      <Footer />

      {/* Modales */}
      {/* Modal Habilitar Vistas */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Habilitar vistas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Autoevaluación */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Autoevaluación</strong>
              </Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Label>
                  Fecha Inicio
                  <Form.Control
                    type="date"
                    value={autoEvalStart}
                    onChange={(e) => setAutoEvalStart(e.target.value)}
                  />
                </Form.Label>
                <Form.Label>
                  Fecha Fin
                  <Form.Control
                    type="date"
                    value={autoEvalEnd}
                    onChange={(e) => setAutoEvalEnd(e.target.value)}
                  />
                </Form.Label>
              </div>
            </Form.Group>

            {/* Evaluación Cruzada */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Evaluación Cruzada</strong>
              </Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Label>
                  Fecha Inicio
                  <Form.Control
                    type="date"
                    value={cruzadaStart}
                    onChange={(e) => setCruzadaStart(e.target.value)}
                  />
                </Form.Label>
                <Form.Label>
                  Fecha Fin
                  <Form.Control
                    type="date"
                    value={cruzadaEnd}
                    onChange={(e) => setCruzadaEnd(e.target.value)}
                  />
                </Form.Label>
              </div>
            </Form.Group>

            {/* Evaluación Pares */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Evaluación Pares</strong>
              </Form.Label>
              <div className="d-flex justify-content-between">
                <Form.Label>
                  Fecha Inicio
                  <Form.Control
                    type="date"
                    value={finalEvalStart}
                    onChange={(e) => setFinalEvalStart(e.target.value)}
                  />
                </Form.Label>
                <Form.Label>
                  Fecha Fin
                  <Form.Control
                    type="date"
                    value={finalEvalEnd}
                    onChange={(e) => setFinalEvalEnd(e.target.value)}
                  />
                </Form.Label>
              </div>
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
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Conformación de Equipos */}
      <Modal show={teamConfigModalShow} onHide={() => setTeamConfigModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Conformación de Equipos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Gestión</Form.Label>
              <Form.Control
                type="text"
                placeholder="2-2024"
                value={formGroupName}
                onChange={(e) => setFormGroupName(e.target.value)}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupStartDate">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={formGroupStartDate}
                    onChange={(e) => setFormGroupStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupEndDate">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={formGroupEndDate}
                    onChange={(e) => setFormGroupEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupMinStudents">
                  <Form.Label>Cantidad Min. de estudiantes</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="3"
                    value={formGroupMinStudents}
                    onChange={(e) => setFormGroupMinStudents(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formGroupMaxStudents">
                  <Form.Label>Cantidad Max. de estudiantes</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="6"
                    value={formGroupMaxStudents}
                    onChange={(e) => setFormGroupMaxStudents(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTeamConfigModalShow(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveChangesGrup}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
}
