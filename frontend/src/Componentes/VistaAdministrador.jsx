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
import { FaUserCircle } from 'react-icons/fa';
import logo from '../img/logo.jpeg';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta
import Docentes from '../Administrador/Docentes';
import axios from 'axios';


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

  useEffect(() => {
    // Obtener el role del localStorage al montar el componente
    const storedRole = localStorage.getItem('role');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRole) {
      setRole(storedRole);
      setNombre(storedNombre);
    }
  }, []); // Se ejecuta solo una vez al montar el componente

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
    localStorage.removeItem('nombre');
    
    // Redirigir al login recargando la página
    window.location.href = '/Login';
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
          {/* Docentes */}
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
        </List>
        <Divider />
      </Drawer>
      <Main open={open}></Main>
      <Footer/>
    </Box>
  );
}

