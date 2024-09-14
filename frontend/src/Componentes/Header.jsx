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
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import {useState} from 'react';


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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const[selectedButton, setSelectedButton]= useState(null);
  const handleButtonClick = (buttonName)=>{
    setSelectedButton(buttonName);
  };


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar 
          sx={{
            backgroundColor: '#FFFFFF', // Cambia el fondo al color deseado
            color: 'black', // Cambia el color del texto a blanco para mejor contraste
          }}
        >
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={() => setOpen(!open)} // Cambia el estado de open con cada clic
            edge="start"
            sx={[
              {
                mr: 2,
              },
              // Puedes eliminar la condición open && { display: 'none' } para que el botón siempre esté visible
            ]}
          >
            <MenuIcon />
          </IconButton>
          <div className="ms-auto d-flex align-items-center">
            <FaUserCircle size={30} className="me-2" /> {/* Ícono de usuario */}
            <span className="m-0">Nombre de Usuario</span> {/* Nombre del usuario */}
            <ExpandMoreIcon/>
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
            backgroundColor: '#2D5981', // Cambia el fondo al color deseado
            color: 'white',
            paddingTop:'30px'
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose} // Cerrar el drawer en pantallas pequeñ
      >
            <div className="d-flex flex-column align-items-center ">
              <img
                src={logo}
                alt="Logo"
                className="rounded-circle"
                style={{ width: '100px', height: '100px'}}
              />
            </div>
        <Divider />

        <List sx={{ mt: 3 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/Planificacion"
              onClick={()=> handleButtonClick('planificacion')}
              sx={{
                borderRadius: '8px',
                backgroundColor: selectedButton === 'planificacion' ? '#1A3254' : 'transparent', // Color al estar seleccionado
                '&:hover': {
                  backgroundColor: '#1A3254', // Color de fondo al hacer hover
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <NoteAltIcon />
              </ListItemIcon>
              <ListItemText primary="Planificación" sx={{ color: 'white' }} />
            </ListItemButton>


            
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
      </Main>
    </Box>
  );
}
