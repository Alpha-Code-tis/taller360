// Header.jsx

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
import GroupsIcon from '@mui/icons-material/Groups';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })( // Sin cambios
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

const AppBar = styled(MuiAppBar, { // Sin cambios
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

const DrawerHeader = styled('div')(({ theme }) => ({ // Sin cambios
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() { // Sin cambios
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => { setOpen(true); };
  const handleDrawerClose = () => { setOpen(false); };

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
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">Nombre de Usuario</span>
            <ExpandMoreIcon />
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
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Planillas Semanales" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/Seguimiento" // Ruta a la Planilla de seguimiento
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
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Seguimiento" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/TareasEstudiante" // Agrega la ruta
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
                <NoteAltIcon /> {/* Puedes cambiar el icono si lo deseas */}
              </ListItemIcon>
              <ListItemText primary="Tareas Estudiante" sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/GenerarPlanilla" // Ruta al generador de planillas
              onClick={() => handleButtonClick('generarPlanilla')} // Cambia el estado del botón seleccionado
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'generarPlanilla' ? '#004080' : 'transparent',
                '&:hover': {
                  backgroundColor: '#004080',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <NoteAltIcon /> {/* Puedes cambiar este ícono si lo prefieres */}
              </ListItemIcon>
              <ListItemText primary="Generar Planilla PDF" sx={{ color: 'white' }} /> {/* Texto descriptivo */}
            </ListItemButton>
          </ListItem>


        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
    </Box>
  );
}
