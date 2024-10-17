import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import logo from '../img/logo.jpeg';
import { FaUserCircle } from 'react-icons/fa';
import useMediaQuery from '@mui/material/useMediaQuery';

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
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
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
  const [evaluacionesOpen, setEvaluacionesOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleEvaluacionesClick = () => {
    setEvaluacionesOpen(!evaluacionesOpen);
  };

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
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
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <div className="ms-auto d-flex align-items-center">
            <FaUserCircle size={30} className="me-2" />
            <span className="m-0">Nombre de Usuario</span>
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
          {/* Botón Estudiantes */}
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

          {/* Botón Equipos */}
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

          {/* Botón Evaluaciones con submenú */}
          <ListItem disablePadding>
            <ListItemButton onClick={handleEvaluacionesClick} sx={{ borderRadius: '8px' }}>
              <ListItemIcon sx={{ color: 'white' }}>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Evaluaciones" sx={{ color: 'white' }} />
              {evaluacionesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={evaluacionesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/Cruzada"
                sx={{
                  pl: 4,
                  backgroundColor: selectedButton === 'cruzada' ? '#1A3254' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#1A3254',
                  },
                }}
                onClick={() => handleButtonClick('cruzada')}
              >
                <ListItemText primary="Cruzada" sx={{ color: 'white' }} />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/AutoEvaluacion"
                sx={{
                  pl: 4,
                  backgroundColor: selectedButton === 'autoEvaluacion' ? '#1A3254' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#1A3254',
                  },
                }}
                onClick={() => handleButtonClick('autoEvaluacion')}
              >
                <ListItemText primary="Auto Evaluación" sx={{ color: 'white' }} />
              </ListItemButton>

              <ListItemButton
                component={Link}
                to="/Pares"
                sx={{
                  pl: 4,
                  backgroundColor: selectedButton === 'pares' ? '#1A3254' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#1A3254',
                  },
                }}
                onClick={() => handleButtonClick('pares')}
              >
                <ListItemText primary="Pares" sx={{ color: 'white' }} />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <Divider />
      </Drawer>
      <Main open={open} />
    </Box>
  );
}
