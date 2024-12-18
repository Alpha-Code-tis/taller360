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
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Importación añadida
import Collapse from '@mui/material/Collapse'; // Asegúrate de importar Collapse
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups'; // Nuevo icono para Equipos
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from './Footer';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
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

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [evaluacionesOpen, setEvaluacionesOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(''); // Estado para el rol
  const [nombre, setNombre] = useState(''); // Estado para el nombre
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const navigate = useNavigate(); // Para redireccionar
  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [selectedButton, setSelectedButton] = useState(null);



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

      setFinalEvalStart(data.fecha_inicio_eva_final);
      setFinalEvalEnd(data.fecha_fin_eva_final);
      setAutoEvalStart(data.fecha_inicio_autoevaluacion);
      setAutoEvalEnd(data.fecha_fin_autoevaluacion);
    } catch (error) {
      toast.error('No se recuperaron los datos.');
    }
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
    localStorage.removeItem('id_estudiante');
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
  const handleButtonClick = (buttonName) => {
    if (buttonName === 'evaluaciones') {
      setEvaluacionesOpen(!evaluacionesOpen);
    }
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
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">{nombre}</span>
            <IconButton onClick={handleMenuOpen}>
              <ExpandMoreIcon />
            </IconButton>
            {/* Menú desplegable */}
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
          {/* Planificación */}
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


          {/* Evaluaciones */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleButtonClick('evaluaciones')}
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'evaluaciones' ? '#1A3254' : 'transparent',
                '&:hover': {
                  backgroundColor: '#1A3254',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Evaluaciones" sx={{ color: 'white' }} />
              {evaluacionesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          {/* Submenú de Evaluaciones */}
          <Collapse in={evaluacionesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link} // Se agrega Link para navegación
                  to="/Cruzada"  // Ruta a la página de Evaluaciones Cruzada
                  onClick={() => handleButtonClick('cruzada')}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cruzada" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* Otras opciones compartidas */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/PlanillasSemanales"
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
        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
      <Footer />
    </Box>
  );
}
