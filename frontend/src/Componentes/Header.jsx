import React, { useState, useEffect } from 'react';
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
  Groups as GroupsIcon, // Nuevo icono para Equipos
  FactCheck as FactCheckIcon,
  CalendarMonth as CalendarMonthIcon,
  Timeline as TimelineIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Checklist as ChecklistIcon,
  Settings as SettingsIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Summarize as SummarizeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Grading, Assignment} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.jpeg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_URL } from '../config';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { Form, Row, Col, Toast, Button } from 'react-bootstrap';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import TableChartIcon from '@mui/icons-material/TableChart';
import Typography from "@mui/material/Typography";

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
  const [nombre, setNombre] = useState(''); // Estado para el nombre del usuario
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú desplegable
  const navigate = useNavigate(); // Para redireccionar
  const [evaluacionesOpen, setEvaluacionesOpen] = useState(false);
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
  const [notificarModalShow, setNotificarModalShow] = useState(false);
  const [planillasOpen, setPlanillasOpen] = useState(false);
  const [reportesOpen, setReportesOpen] = useState(false);
  const [errors, setErrors] = useState({});
  // Estados para almacenar las opciones de evaluaciones y las fechas
  const [fechas, setFechas] = useState([]);
  const [selectedTipos, setSelectedTipos] = useState(["autoevaluacion"]); // Valor inicial por defecto
  const handleButtonClick = (button) => {
    console.log('Botón clickeado:', button);
    console.log('Estado actual evaluacionesOpen:', evaluacionesOpen);

    if (button === 'evaluaciones') {
      setEvaluacionesOpen((prev) => !prev);
    }

    if (button === 'planillas') {
      setPlanillasOpen((prev) => !prev);
    }

    if (button === 'reportes') {
      setReportesOpen((prev) => !prev);
    }

    setSelectedButton(button);
  };

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
  const [formGroupStartDate, setFormGroupStartDate] = useState('');
  const [formGroupEndDate, setFormGroupEndDate] = useState('');
  const [formGroupMinStudents, setFormGroupMinStudents] = useState('');
  const [formGroupMaxStudents, setFormGroupMaxStudents] = useState('');

  const validateForm = () => {
    const newErrors = {};
  
    const gestionRegex = /^[0-9]+-[0-9]{4}$/; 
    if (!formGroupName.trim()) {
      newErrors.formGroupName = "La gestión es obligatoria.";
    } else if (!gestionRegex.test(formGroupName.trim())) {
      newErrors.formGroupName = "El formato de gestión debe ser número-mes-año (e.g., 2-2024).";
    }
  

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; 
    if (!formGroupStartDate.trim()) {
      newErrors.formGroupStartDate = "La fecha de inicio es obligatoria.";
    } else if (!dateRegex.test(formGroupStartDate.trim())) {
      newErrors.formGroupStartDate = "El formato de la fecha de inicio debe ser dd/mm/aaaa.";
    }

    if (!formGroupEndDate.trim()) {
      newErrors.formGroupEndDate = "La fecha de fin es obligatoria.";
    } else if (!dateRegex.test(formGroupEndDate.trim())) {
      newErrors.formGroupEndDate = "El formato de la fecha de fin debe ser dd/mm/aaaa.";
    }

    const minStudents = parseInt(formGroupMinStudents, 10);
    if (!formGroupMinStudents.trim() || isNaN(minStudents)) {
      newErrors.formGroupMinStudents = "La cantidad mínima de estudiantes debe ser un número.";
    } else if (minStudents < 0) {
      newErrors.formGroupMinStudents = "La cantidad mínima de estudiantes no puede ser un número negativo.";
    } else if (minStudents < 3) {
      newErrors.formGroupMinStudents = "La cantidad mínima de estudiantes no puede ser menor a 3.";
    }
  
    const maxStudents = parseInt(formGroupMaxStudents, 10);
    if (!formGroupMaxStudents.trim() || isNaN(maxStudents)) {
      newErrors.formGroupMaxStudents = "La cantidad máxima de estudiantes debe ser un número.";
    } else if (maxStudents < 0) {
      newErrors.formGroupMaxStudents = "La cantidad máxima de estudiantes no puede ser un número negativo.";
    } else if (maxStudents > 6) {
      newErrors.formGroupMaxStudents = "La cantidad máxima de estudiantes no puede ser mayor a 6.";
    }
  

    if (minStudents > maxStudents) {
      newErrors.formGroupMinStudents = "La cantidad mínima no puede ser mayor a la cantidad máxima.";
      newErrors.formGroupMaxStudents = "La cantidad máxima no puede ser menor a la cantidad mínima.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  
  const formatToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }; 
  const validateForma = () => {
    const merrores = {};
  
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; 
  
    const compareDatesStrict = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      return startDate < endDate; 
    };
  
    if (!autoEvalStart.trim()) {
      merrores.autoEvalStart = "La fecha de inicio es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(autoEvalStart))) {
      merrores.autoEvalStart = "El formato de la fecha debe ser dd/mm/aaaa.";
    }
  
    if (!autoEvalEnd.trim()) {
      merrores.autoEvalEnd = "La fecha fin es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(autoEvalEnd))) {
      merrores.autoEvalEnd = "El formato de la fecha debe ser dd/mm/aaaa.";
    } else if (!compareDatesStrict(autoEvalStart, autoEvalEnd)) {
      merrores.autoEvalEnd = "La fecha fin debe ser mayor que la fecha de inicio.";
    }
  
    if (!cruzadaStart.trim()) {
      merrores.cruzadaStart = "La fecha de inicio es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(cruzadaStart))) {
      merrores.cruzadaStart = "El formato de la fecha debe ser dd/mm/aaaa.";
    }
  
    if (!cruzadaEnd.trim()) {
      merrores.cruzadaEnd = "La fecha fin es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(cruzadaEnd))) {
      merrores.cruzadaEnd = "El formato de la fecha debe ser dd/mm/aaaa.";
    } else if (!compareDatesStrict(cruzadaStart, cruzadaEnd)) {
      merrores.cruzadaEnd = "La fecha fin debe ser mayor que la fecha de inicio.";
    }
  
    if (!finalEvalStart.trim()) {
      merrores.finalEvalStart = "La fecha de inicio es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(finalEvalStart))) {
      merrores.finalEvalStart = "El formato de la fecha debe ser dd/mm/aaaa.";
    }
  
    if (!finalEvalEnd.trim()) {
      merrores.finalEvalEnd = "La fecha fin es obligatoria.";
    } else if (!dateRegex.test(formatToDDMMYYYY(finalEvalEnd))) {
      merrores.finalEvalEnd = "El formato de la fecha debe ser dd/mm/aaaa.";
    } else if (!compareDatesStrict(finalEvalStart, finalEvalEnd)) {
      merrores.finalEvalEnd = "La fecha fin debe ser mayor que la fecha de inicio.";
    }

    if (!notaPares || isNaN(notaPares) || notaPares < 1 || notaPares > 100) {
      merrores.notaPares = "El campo Nota Pares debe ser un número entre 1 y 100.";
    }
  
    setErrors(merrores);
    return Object.keys(merrores).length === 0;
  };
  

  const validateFor = () => {
    const error = {};
  
    if (!paresEvalNota || paresEvalNota === "") {
      error.paresEvalNota = "El campo Evaluación Pares es obligatorio.";
    } else if (isNaN(paresEvalNota) || paresEvalNota < 1 || paresEvalNota > 100) {
      error.paresEvalNota = "El campo Evaluación Pares debe ser un número entre 1 y 100.";
    }
  
    if (!autoEvalNota || autoEvalNota === "") {
      error.autoEvalNota = "El campo Autoevaluación es obligatorio.";
    } else if (isNaN(autoEvalNota) || autoEvalNota < 1 || autoEvalNota > 100) {
      error.autoEvalNota = "El campo Autoevaluación debe ser un número entre 1 y 100.";
    }
  
    if (!docenteEvalNota || docenteEvalNota === "") {
      error.docenteEvalNota = "El campo Evaluación Docente es obligatorio.";
    } else if (isNaN(docenteEvalNota) || docenteEvalNota < 1 || docenteEvalNota > 100) {
      error.docenteEvalNota = "El campo Evaluación Docente debe ser un número entre 1 y 100.";
    }
  
    setErrors(error);
    return Object.keys(error).length === 0;
  };
  
  const validateNotif = () => {
    const errorMessage = {};
    if (!notificacion.trim()) {
      errorMessage.notificacion = 'El campo de detalles es obligatorio.';
    } 
    else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]{10,50}$/.test(notificacion)) {
      errorMessage.notificacion = 'El campo debe contener entre 10 y 50 caracteres, y solo puede incluir letras,comas y acentos.';
    }
  
    setErrors(errorMessage);
    return Object.keys(errorMessage).length === 0;
  };
  



  const handleSaveChanges = async () => {

    if (!validateForma()) {
      toast.error("Por favor, corrige los errores antes de guardar.");
      return;
    }

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
      setAutoEvalStart('');
      setAutoEvalEnd('');
      setCruzadaStart('');
      setCruzadaEnd('');
      setFinalEvalStart('');
      setFinalEvalEnd('');
      setNotaPares('');
    } catch (error) {
      toast.error('Error al guardar las fechas');
    }
  };

  const handleSaveChangesGrup = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrige los errores antes de guardar.");
      return;
    }
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
      setFormGroupName('');
      setFormGroupStartDate('');
      setFormGroupEndDate('');
      setFormGroupMinStudents('');
      setFormGroupMaxStudents('');
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
    if (!validateFor()) {
      toast.error("Por favor, corrige los errores antes de guardar.");
      return;
    }

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
      setAutoEvalStart('');
      setAutoEvalEnd('');
      setCruzadaStart('');
      setCruzadaEnd('');
      setFinalEvalStart('');
      setFinalEvalEnd('');
      setNotaPares('');
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
    if (!validateNotif()) {
      toast.error("Por favor, corrige los errores antes de guardar.");
      return;
    }

    const data = {
      titulo: "Notificación de Evaluaciones",
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
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem', color: '#2D5981', }}
          >
          {`Bienvenido, ${nombre}`}
          </Typography>
          <div className="ms-auto d-flex align-items-center">
            {role === 'docente' && (
              <IconButton color="primary" onClick={handleSettingsMenuOpen} className="me-3">
                <SettingsIcon />
              </IconButton>
            )}
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007BFF' }}>
              {role.toUpperCase()}
            </span>
            <IconButton onClick={handleMenuOpen}>
              <ExpandMoreIcon />
            </IconButton>
            <Menu anchorEl={settingsMenuAnchor} open={Boolean(settingsMenuAnchor)} onClose={handleSettingsMenuClose}>
              <MenuItem onClick={() => { setModalShow(true); handleSettingsMenuClose(); }}>Habilitar vistas</MenuItem>
              <MenuItem onClick={() => { setTeamConfigModalShow(true); handleSettingsMenuClose(); }}>Conformación de Equipos</MenuItem>
              <MenuItem onClick={() => { setEvaluacionModalShow(true); handleSettingsMenuClose(); }}>Configuracion de Evaluaciones por Sprint</MenuItem>
              <MenuItem onClick={() => { setNotificarModalShow(true); handleSettingsMenuClose(); }}>Notificar Evaluaciones</MenuItem>
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
        open={open || !isMobile}
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

              {/* Submenú Cruzada */}
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
                  {/* Autoevaluación */}
                  {dayjs().isSameOrAfter(dayjs(autoEvalStart), 'day') &&
                    dayjs().isSameOrBefore(dayjs(autoEvalEnd), 'day') && (
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          to="/Autoevaluacion"
                          onClick={() => handleButtonClick('autoevaluacion')}
                          sx={{
                            pl: 4,
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
                            pl: 4,
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
                  <ListItemText primary="Formulario de Evaluación" sx={{ color: 'white' }} />
                </ListItemButton>
              </ListItem>

                {/* Evaluación */}
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
                    <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Evaluacion" sx={{ color: 'white' }} />
                    {evaluacionesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                </ListItem>
              {/* Submenú evaluaciones */}
              <Collapse in={evaluacionesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          to="/ListaAutoevaluacion"
                          onClick={() => handleButtonClick('listaAutoevaluacion')}
                          sx={{
                            pl: 4,
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
                      <ListItemText primary="Lista Autoevaluacion" sx={{ color: 'white' }} />
                    </ListItemButton>
                  </ListItem>

                  {/* Botón de Evaluación Entre Equipos */}
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/EvaluacionEntreEquipos"
                      onClick={() => handleButtonClick('EvaluacionEntreEquipos')}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'EvaluacionEntreEquipos' ? '#1A3254' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#1A3254',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        <GroupIcon /> {/* Puedes reemplazar este ícono por uno relacionado con equipos */}
                      </ListItemIcon>
                      <ListItemText primary="Evaluación Entre Equipos" sx={{ color: 'white' }} />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/CriterioEvaluacion"
                      onClick={() => handleButtonClick('criterioEvaluacion')}
                      sx={{
                        pl: 4,
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
              </Collapse>

                {/* Planillas */}
                <ListItem disablePadding>
                  <ListItemButton
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
                  <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Planillas" sx={{ color: 'white' }} />
                  {planillasOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>

              {/* Submenú planillas */}
              <Collapse in={planillasOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {/* Planilla Semanales */}
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/PlanillasSemanales"
                      onClick={() => handleButtonClick('planillasSemanales')}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'planillasSemanales' ? '#1A3254' : 'transparent',
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
                      to="/PlanillaNotas"
                      onClick={() => handleButtonClick('planillaNotas')}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'planillaNotas' ? '#1A3254' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#1A3254',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        <Grading />
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
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'planillaNotasFinal' ? '#1A3254' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#1A3254',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText primary="Planilla de Notas Final" sx={{ color: 'white' }} />
                    </ListItemButton>
                  </ListItem>

                </List>
              </Collapse>

                {/* Reportes */}
                <ListItem disablePadding>
                  <ListItemButton
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
                  <TableChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reportes" sx={{ color: 'white' }} />
                  {reportesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItemButton>
              </ListItem>

              {/* Submenú reportes */}
              <Collapse in={reportesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/ReportePorEvaluaciones"
                      onClick={() => handleButtonClick('ReportePorEvaluaciones')}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'ReportePorEvaluaciones' ? '#1A3254' : 'transparent',
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

                  {/* Reportes */}
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/ReporteEquipoEstudiante"
                      onClick={() => handleButtonClick('reporteequipoestudiante')}
                      sx={{
                        pl: 4,
                        borderRadius: '8px',
                        backgroundColor: selectedButton === 'reporteequipoestudiante' ? '#1A3254' : 'transparent',
                        '&:hover': {
                          backgroundColor: '#1A3254',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: 'white' }}>
                        <AssessmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="ReporteEquipoEst" sx={{ color: 'white' }} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>




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
                        isInvalid={!!errors.formGroupName}
                      />
                    <Form.Control.Feedback type="invalid">{errors.formGroupName}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupStartDate">
                          <Form.Label>Fecha Inicio</Form.Label>
                          <Form.Control type="text" placeholder="dd/mm/aaaa" value={formGroupStartDate} // Vincula el valor con el estado
                            onChange={(e) => setFormGroupStartDate(e.target.value)} 
                            isInvalid={!!errors.formGroupStartDate}
                            />
                            <Form.Control.Feedback type="invalid">{errors.formGroupStartDate}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupEndDate">
                          <Form.Label>Fecha Fin</Form.Label>
                          <Form.Control type="text" placeholder="dd/mm/aaaa" value={formGroupEndDate} // Vincula el valor con el estado
                            onChange={(e) => setFormGroupEndDate(e.target.value)} 
                            isInvalid={!!errors.formGroupEndDate}
                            />
                            <Form.Control.Feedback type="invalid">{errors.formGroupEndDate}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupMinStudents">
                          <Form.Label>Cantidad Min. de estudiantes</Form.Label>
                          <Form.Control type="text" placeholder="3" value={formGroupMinStudents} // Vincula el valor con el estado
                            onChange={(e) => setFormGroupMinStudents(e.target.value)} 
                            isInvalid={!!errors.formGroupMinStudents}/>
                            <Form.Control.Feedback type="invalid">{errors.formGroupMinStudents}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className="mb-3" controlId="formGroupMaxStudents">
                          <Form.Label>Cantidad Max. de estudiantes</Form.Label>
                          <Form.Control type="text" placeholder="6" value={formGroupMaxStudents} // Vincula el valor con el estado
                            onChange={(e) => setFormGroupMaxStudents(e.target.value)}
                            isInvalid={!!errors.formGroupMaxStudents} />
                            <Form.Control.Feedback type="invalid">{errors.formGroupMaxStudents}</Form.Control.Feedback>
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
                            isInvalid={!!errors.autoEvalStart}/>
                            <Form.Control.Feedback type="invalid">{errors.autoEvalStart}</Form.Control.Feedback>
                        </Form.Label>
                        <Form.Label>Fecha Fin
                          <Form.Control type="date" value={autoEvalEnd} 
                          onChange={(e) => setAutoEvalEnd(e.target.value)} 
                          isInvalid={!!errors.autoEvalEnd}/>
                            <Form.Control.Feedback type="invalid">{errors.autoEvalEnd}</Form.Control.Feedback>
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
                            isInvalid={!!errors.cruzadaStart}/>
                            <Form.Control.Feedback type="invalid">{errors.cruzadaStart}</Form.Control.Feedback>
                        </Form.Label>
                        <Form.Label>
                          Fecha Fin
                          <Form.Control
                            type="date"
                            value={cruzadaEnd}
                            onChange={(e) => setCruzadaEnd(e.target.value)}
                            isInvalid={!!errors.cruzadaEnd}/>
                            <Form.Control.Feedback type="invalid">{errors.cruzadaEnd}</Form.Control.Feedback>
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
                            value={finalEvalStart}
                            onChange={(e) => setFinalEvalStart(e.target.value)}
                            isInvalid={!!errors.finalEvalStart}/>
                            <Form.Control.Feedback type="invalid">{errors.finalEvalStart}</Form.Control.Feedback>
                        </Form.Label>
                        <Form.Label>
                          Fecha Fin
                          <Form.Control
                            type="date"
                            value={finalEvalEnd}
                            onChange={(e) => setFinalEvalEnd(e.target.value)}
                            isInvalid={!!errors.finalEvalEnd}/>
                            <Form.Control.Feedback type="invalid">{errors.finalEvalEnd}</Form.Control.Feedback>
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
                          isInvalid={!!errors.notaPares}/>
                          <Form.Control.Feedback type="invalid">{errors.notaPares}</Form.Control.Feedback>
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
                            isInvalid={!!errors.autoEvalNota}/>
                            <Form.Control.Feedback type="invalid">{errors.autoEvalNota}</Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label><strong>Evaluación Pares</strong></Form.Label>
                          <Form.Control
                            type="number"
                            value={paresEvalNota}
                            onChange={(e) => setParesEvalNota(e.target.value)}
                            isInvalid={!!errors.paresEvalNota}/>
                            <Form.Control.Feedback type="invalid">{errors.paresEvalNota}</Form.Control.Feedback>
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
                            isInvalid={!!errors.docenteEvalNota}/>
                            <Form.Control.Feedback type="invalid">{errors.docenteEvalNota}</Form.Control.Feedback>
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
                <Modal.Header closeButton>
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
                            isInvalid={!!errors.notificacion}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.notificacion}
                          </Form.Control.Feedback>
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
                  <Button variant="secondary" onClick={() => setNotificarModalShow(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" onClick={handleSaveChangesNotif}>
                    Guardar cambios
                  </Button>
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
