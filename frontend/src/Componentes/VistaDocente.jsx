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
import ChecklistIcon from '@mui/icons-material/Checklist';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.jpeg';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GroupsIcon from '@mui/icons-material/Groups'; // Nuevo icono para Equipos
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';
import SettingsIcon from '@mui/icons-material/Settings';

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

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(''); // Estado para el rol
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const navigate = useNavigate(); // Para redireccionar
  const [modalShow, setModalShow] = useState(false);
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');


  const fetchFechas = async () => {
    try {
        const response = await axios.get(`${API_URL}ajustes`);
        const data = response.data;

        setAutoEvalStart(data.fecha_inicio_autoevaluacion);
        setAutoEvalEnd(data.fecha_fin_autoevaluacion);
        setFinalEvalStart(data.fecha_inicio_eva_final);
        setFinalEvalEnd(data.fecha_fin_eva_final);
    } catch (error) {
        toast.error('No se recuperaron los datos.');
    }
  };

  useEffect(() => {
    // Obtener el role del localStorage al montar el componente
    const storedRole = localStorage.getItem('role');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRole) {
      setRole(storedRole);
      setNombre(storedNombre);
    }
    fetchFechas();
  }, []);



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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [selectedButton, setSelectedButton] = useState(null);
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleSaveChanges = async () => {
    const payload = {
        fecha_inicio_autoevaluacion: autoEvalStart,
        fecha_fin_autoevaluacion: autoEvalEnd,
        fecha_inicio_eva_final: finalEvalStart,
        fecha_fin_eva_final: finalEvalEnd,
    };

    try {
        await axios.patch(`${API_URL}ajustes`, payload);
        toast.success('Fechas guardadas correctamente');
        setModalShow(false);
    } catch (error) {
        toast.error('Error al guardar las fechas');
    }
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
            <IconButton color="primary" aria-label="ajustes" onClick={() => setModalShow(true)} className="me-3">
              <SettingsIcon />
            </IconButton>
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">{nombre}</span>
            <IconButton onClick={handleMenuOpen}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
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
          {/* vista docente */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanificacionEquipos"
              onClick={() => handleButtonClick('planificacionEquipos')}
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'docentes' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Planificacion de Equipos" sx={{ color: 'white' }} />
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
                <PersonIcon /> {/* Aquí mantenemos el icono de persona */}
              </ListItemIcon>
              <ListItemText primary="Estudiantes" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          {/* ListaAutoevaluacion */}
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
                <PictureAsPdfIcon/>
              </ListItemIcon>
              <ListItemText primary="Generar Planilla PDF" sx={{ color: 'white' }} />
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
        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
      <Footer/>

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
    </Box>
  );
}