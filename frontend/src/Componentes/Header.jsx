import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
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
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
  NoteAlt as NoteAltIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  FactCheck as FactCheckIcon,
  CalendarMonth as CalendarMonthIcon,
  Timeline as TimelineIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Checklist as ChecklistIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups'; // Nuevo icono para Equipos
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SummarizeIcon from '@mui/icons-material/Summarize';
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
import SettingsIcon from '@mui/icons-material/Settings';
import Select from 'react-select';
import { Form, Row, Col, Toast, Button } from 'react-bootstrap';
import StarIcon from '@mui/icons-material/Star';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

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
  })
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
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(''); // Estado para el rol
  const [nombre, setNombre] = useState(''); // Estado para el nombre del usuario
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const navigate = useNavigate(); // Para redireccionar

  const [finalEvalStart, setFinalEvalStart] = useState('');
  const [finalEvalEnd, setFinalEvalEnd] = useState('');
  const [autoEvalStart, setAutoEvalStart] = useState('');
  const [autoEvalEnd, setAutoEvalEnd] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [evaluacionModalShow, setEvaluacionModalShow] = useState(false);
  const [autoEvalNota, setAutoEvalNota] = useState('');
  const [paresEvalNota, setParesEvalNota] = useState('');
  const [docenteEvalNota, setDocenteEvalNota] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [sprintSeleccionado, setSprintSeleccionado] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [sprints, setSprints] = useState([]); 
  const [notaPares, setNotaPares] = useState('');
  const [notificacion, setNotificacion] = useState('');
  const [redirected, setRedirected] = useState(false);
  const [cruzadaStart, setCruzadaStart] = useState('');
  const [cruzadaEnd, setCruzadaEnd] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  // Estados para almacenar las opciones de evaluaciones y las fechas
  const [fechas, setFechas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState(["autoevaluacion"]); // Valor inicial por defecto

  // Función para obtener las fechas de las evaluaciones basadas en los tipos seleccionados
  const obtenerFechasEvaluaciones = async (tipos) => {
    try {
      let url = `${API_URL}listaFechasEvaluciones?tipos[]=${tipos[0]}`;
      // Añadir más tipos si es necesario
      if (tipos.length > 1) {
        tipos.forEach((tipo) => {
          url += `&tipos[]=${tipo}`;
        });
      }

      // Hacer la solicitud GET
      const response = await axios.get(url);

      console.log(response.data);
      // Actualizar el estado con las fechas recibidas
      setFechas(response.data);
    } catch (error) {
      // Si hay un error, verificar la respuesta
    if (error.response) {
      // Respuesta de error del servidor (por ejemplo, 404)
      console.error("Error del servidor:", error.response.status);
      console.error("Respuesta del servidor:", error.response.data);
    } else {
      // Error en la solicitud
      console.error("Error en la solicitud:", error.message);
    }

    }
  };

// useEffect para cargar las fechas cada vez que cambia la selección
useEffect(() => {
  obtenerFechasEvaluaciones(selectedTipos);
}, [selectedTipos]); // Se ejecuta cada vez que `selectedTipos` cambie


  // Manejar cambio en la selección del `select`
  const handleChangee = (event) => {
    const { value } = event.target;
    // Si se selecciona una opción, actualizamos los tipos seleccionados
    setSelectedTipos(value.split(','));
  };



  const handleChange = (e) => {
    setNotificacion(e.target.value); // Actualiza el estado con el texto ingresado
  };


  useEffect(() => {
    // Obtener el role del localStorage al montar el componente
    const storedRole = localStorage.getItem('role');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRole) {
      setRole(storedRole);
    }
    if (storedNombre) {
      setNombre(storedNombre);
    }
    fetchFechas();
    fetchEmpresas();
    if (empresaSeleccionada && sprintSeleccionado) {
      fetchNotasPorEmpresaYSprint(empresaSeleccionada, sprintSeleccionado);
    }
  }, [empresaSeleccionada, sprintSeleccionado]);
  
  const fetchNotasPorEmpresaYSprint = async (empresaId, sprintId) => {
    try {
      const response = await axios.get(
        `${API_URL}configNotasDocente/${empresaId}/${sprintId}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Requiere autenticación
          },
        }
      );
      
      const data = response.data;
  
      // Actualiza los campos de evaluación con los datos obtenidos
      setAutoEvalNota(data.autoevaluacion ?? '');
      setParesEvalNota(data.pares ?? '');
      setDocenteEvalNota(data.evaluaciondocente ?? '');
    } catch (error) {
      toast.error('No se pudieron cargar las notas para la empresa y sprint seleccionados.');
    }
  };
  const fetchEmpresas = async () => {
    try {
      const response = await axios.get(`${API_URL}listarEmpresas/2-2024`);
      setEmpresas(response.data || []); // Suponiendo que el array de empresas viene aquí
    } catch (error) {
      toast.error("No se pudieron cargar las empresas.");
    }
  };
  const fetchSprints = async (empresaId) => {
    try {
      const response = await axios.get(`${API_URL}listarSprintsEmpresa/${empresaId}`);
      setSprints(response.data || []); // Filtra los sprints según la empresa
    } catch (error) {
      toast.error("No se pudieron cargar los sprints.");
    }
  };
  useEffect(() => {
    // Verificar si el usuario no ha sido redirigido aún
    if (!redirected && role) {
      // Redirigir según el rol
      if (role === "administrador") {
        navigate("/Docentes");
      } else if (role === "docente") {
        navigate("/PlanificacionEquipos");
      } else if (role === "estudiante") {
        navigate("/Planificacion");
      }
      setRedirected(true); // Marcar que la redirección inicial ya ocurrió
    }
  }, [role, redirected, navigate]);



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

  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

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
    console.log(payload);
    try {
      await axios.post(`${API_URL}gestion`, payload);
      toast.success('Fechas guardadas correctamente');
      setTeamConfigModalShow(false);
    } catch (error) {
      toast.error('Error al guardar las fechas');
      console.error('Error al guardar las fechas:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      } else if (error.request) {
        console.error('Sin respuesta del servidor. Solicitud realizada:', error.request);
      } else {
        console.error('Error de configuración:', error.message);
      }
    }
  };

  const handleSaveChangesEva = async () => {
    const payload = {
      empresa: parseInt(empresaSeleccionada, 10),
      sprint: parseInt(sprintSeleccionado, 10),
      autoevaluacion: parseInt(autoEvalNota, 10),
      pares: parseInt(paresEvalNota, 10),
      evaluaciondocente: parseInt(docenteEvalNota, 10),
    };

    try {
      const response = await axios.post(`${API_URL}configNotas`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success(
        response.status === 201
          ? 'Evaluación creada correctamente'
          : 'Evaluación actualizada correctamente'
      );
      setEvaluacionModalShow(false);
    } catch (error) {
      let errorMessage = 'Ocurrió un error.';

      if (error.response) {
        const responseData = error.response.data;

        // Verificar si hay un mensaje de conflicto específico
        if (responseData.message) {
          errorMessage = responseData.message;
        }

        // Si hay errores de validación
        if (responseData.errors) {
          const backendErrors = responseData.errors;
          errorMessage += ' Errores: ' + Object.values(backendErrors).join(', '); // Mostrar errores específicos
        }
      }

      // Mostrar el mensaje de error junto con los datos que se intentaron enviar
      toast.error(errorMessage);
    }
  };

  /**Enviar notificaciones*/
  const handleSaveChangesNotif = async () => {
      const data = {
        titulo:"Notificación de Evaluaciones",
        mensaje: notificacion,
        tipos: selectedTipos,
      };

    try {
      await axios.post(`${API_URL}notificacion`, data);
      setToastMessage('Notificación guardada correctamente');
      setToastVariant('success');
      setShowToast(true);
    } catch (error) {
      if (error.response) {
        setToastMessage('Error al guardar la notificación: ' + error.response.data.message);
        setToastVariant('danger');
      } else {
        setToastMessage('Error de red o de conexión');
        setToastVariant('danger');
      }
      setShowToast(true);
    }
  };

  const [selectedButton, setSelectedButton] = useState(null);


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
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
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
              <MenuItem
                onClick={() => {
                  setEvaluacionModalShow(true);
                  handleSettingsMenuClose();
                }}
              >
                Configuración de Evaluaciones
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
        variant="persistent"
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
          {/* Menú para Estudiante */}
          {role === 'estudiante' && (
            <>
              {/* Planificación */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Planificacion"
                  onClick={() => handleButtonClick('planificacion')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedButton === 'planificacion' ? '#1A3254' : 'transparent',
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
                    <GroupsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Equipos" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              {/* Tareas Estudiante */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/TareasEstudiante"
                  onClick={() => handleButtonClick('tareasEstudiante')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedButton === 'tareasEstudiante' ? '#1A3254' : 'transparent',
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

              {/* Evaluaciones */}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleButtonClick('evaluaciones')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedButton === 'evaluaciones' ? '#1A3254' : 'transparent',
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
              <Collapse in={evaluacionesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      component={Link}
                      to="/Cruzada"
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

              {/* Seguimiento */}
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Seguimiento"
                  onClick={() => handleButtonClick('seguimiento')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedButton === 'seguimiento' ? '#1A3254' : 'transparent',
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

              {/* Autoevaluación */}
              {dayjs().isSameOrAfter(dayjs(autoEvalStart), 'day') &&
                dayjs().isSameOrBefore(dayjs(autoEvalEnd), 'day') && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/Autoevaluacion"
                      onClick={() => handleButtonClick('autoevaluacion')}
                      sx={{
                        borderRadius: '8px',
                        backgroundColor:
                          selectedButton === 'autoevaluacion' ? '#1A3254' : 'transparent',
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

              {/* Evaluación Pares */}
              {dayjs().isSameOrAfter(dayjs(finalEvalStart), 'day') &&
                dayjs().isSameOrBefore(dayjs(finalEvalEnd), 'day') && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/EvaluacionPares"
                      onClick={() => handleButtonClick('evaluacionPares')}
                      sx={{
                        borderRadius: '8px',
                        backgroundColor:
                          selectedButton === 'evaluacionPares' ? '#1A3254' : 'transparent',
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
            </>
          )}

          {/* Menú para Administrador */}
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
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText primary="Docentes" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {/* Menú para Docente */}
          {role === 'docente' && (
            <>
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
                    <NoteAltIcon />
                  </ListItemIcon>
                  <ListItemText primary="Planificación de equipos" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/Estudiantes"
                  onClick={() => handleButtonClick('estudiantes')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor:
                      selectedButton === 'estudiantes' ? '#1A3254' : 'transparent',
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

              {/* Planilla Semanales */}
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
                  <ListItemText primary="Planilla de Notas" sx={{ color: 'white' }} />
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
                    <SummarizeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reporte por Evaluaciones" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/CualificarResultados"
                  onClick={() => handleButtonClick('CualificarRes')}
                  sx={{
                    borderRadius: '8px',
                    backgroundColor: selectedButton === 'CualificarRes' ? '#1A3254' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#1A3254',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>
                  <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cualificar Resultados" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

              {/* Modal Conformación de Equipos */}
              <Modal
                show={teamConfigModalShow}
                onHide={() => setTeamConfigModalShow(false)}
                centered
              >
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
                            type="text"
                            placeholder="dd/mm/aaaa"
                            value={formGroupStartDate}
                            onChange={(e) => setFormGroupStartDate(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupEndDate">
                          <Form.Label>Fecha Fin</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="dd/mm/aaaa"
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
                            type="text"
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
                            type="text"
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

              {/* Modal Habilitar Vistas */}
              <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Habilitar vistas</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
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
                        <Form.Label>Fecha Fin
                          <Form.Control type="date" value={autoEvalEnd} onChange={(e) => setAutoEvalEnd(e.target.value)} />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Evaluación Cruzada</strong></Form.Label>
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
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Evaluación Pares</strong></Form.Label>
                      <div className="d-flex justify-content-between">
                        <Form.Label>
                          Fecha Inicio
                          <Form.Control
                            type="date"
                            value={cruzadaStart}
                            onChange={(e) => setCruzadaStart(e.target.value)}
                          />
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
                  <Button variant="secondary" onClick={() => setModalShow(false)}>
                    Cerrar
                  </Button>
                  <Button variant="primary" onClick={handleSaveChanges}>
                    Guardar cambios
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Modal Configuración de Evaluaciones */}
              <Modal
                show={evaluacionModalShow}
                onHide={() => setEvaluacionModalShow(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Configuracion de Evaluaciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    {/* Selección de Empresa */}
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Seleccionar Empresa</strong></Form.Label>
                      <Form.Select
                        value={empresaSeleccionada}
                        onChange={(e) => {
                          setEmpresaSeleccionada(e.target.value);
                          fetchSprints(e.target.value); // Llama a la función para obtener los sprints
                        }}
                      >
                        <option value="">Selecciona una empresa</option>
                        {empresas.map((empresa) => (
                          <option key={empresa.id_empresa} value={empresa.id_empresa}>
                            {empresa.nombre_empresa}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Selección de Sprint */}
                    <Form.Group className="mb-3">
                      <Form.Label><strong>Seleccionar Sprint</strong></Form.Label>
                      <Form.Select
                        value={sprintSeleccionado}
                        onChange={(e) => setSprintSeleccionado(e.target.value)}
                      >
                        <option value="">Selecciona un sprint</option>
                        {sprints.map((sprint) => (
                          <option key={sprint} value={sprint}>
                            {sprint}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {/* Controles en dos columnas */}
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Autoevaluación</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={autoEvalNota}
                            onChange={(e) => setAutoEvalNota(e.target.value)}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Evaluación Pares</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={paresEvalNota}
                            onChange={(e) => setParesEvalNota(e.target.value)}
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Evaluación Docente</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={docenteEvalNota}
                            onChange={(e) => setDocenteEvalNota(e.target.value)}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setEvaluacionModalShow(false)}>
                    Cerrar
                  </Button>
                  <Button variant="primary" onClick={handleSaveChangesEva}>
                    Guardar cambios
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={notificarModalShow} onHide={() => setNotificarModalShow(false)} centered>
                <Modal.Header>
                  <Modal.Title>Notificar Evaluaciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-3">
                    <Row>
                      <Col md={12}>
                        <Form.Group controlId="formEvaluaciones" className="mb-3">
                          <Form.Label>Seleccionar Tipos de Evaluaciones</Form.Label>
                          {/* Lista desplegable con las opciones */}
                          <select onChange={handleChangee} value={selectedTipos.join(',')}>
                            <option value="autoevaluacion"> Autoevaluación</option>
                            <option value="pares">EV Pares</option>
                            <option value="cruzada"> EV Cruzada</option>
                            <option value="autoevaluacion,pares"> Autoevaluación + EV Pares</option>
                            <option value="autoevaluacion,cruzada"> Autoevaluación + EV Cruzada</option>
                            <option value="pares,cruzada"> EV Pares + EV Cruzada</option>
                            <option value="autoevaluacion,pares,cruzada"> Autoevaluación + EV Pares + EV Cruzada</option>
                          </select>
                          {/* Mostrar las fechas de las evaluaciones seleccionadas */}
                              <div>
                                <label>Fechas de Evaluación:</label>
                                <ul>
                                  {Object.keys(fechas).length > 0 ? (
                                    Object.keys(fechas).map((tipo) => (
                                      <li key={tipo}>
                                        <strong>{tipo}</strong>:
                                          {fechas[tipo].fecha_inicio && fechas[tipo].fecha_fin ?
                                            `${fechas[tipo].fecha_inicio} - ${fechas[tipo].fecha_fin}` :
                                            "Fecha no disponible"
                                          }
                                      </li>
                                    ))
                                  ) : (
                                    <p>No se encontraron evaluaciones para mostrar.</p>
                                  )}
                                </ul>
                              </div>
                        </Form.Group>
                      </Col>
                    </Row>
                      {/* Detalles de notificacion */}
                      <div>
                        <Form.Group className="mt-3">
                          <Form.Label><strong>Detalles </strong></Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={6}
                            value={notificacion}
                            onChange={handleChange}
                            placeholder="Ingrese los detalles de la notificación"
                            style={{ width: "380px", height: "50px" }}
                          />
                        </Form.Group>
                      </div>

                    </Form.Group>
                  </Form>
                  {/* Toast para mostrar el mensaje de éxito o error */}
                  <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                    className="position-fixed bottom-0 end-0 m-3"
                  >
                    <Toast.Body>{toastMessage}</Toast.Body>
                  </Toast>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setEvaluacionModalShow(false)}>
                    Cerrar
                  </Button>
                  <Button variant="primary" onClick={handleSaveChangesEva}>
                    Guardar cambios
                  </Button>
                </Modal.Footer>
               </Modal>
            </>
          )}
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>{/* Contenido principal */}</Main>
    </Box>
  );
}
