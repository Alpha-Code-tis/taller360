import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInicio= (e) => {
    e.preventDefault();
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('Correo electrónico no válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Si las validaciones no pasan, no continuar con la autenticación
    if (!isValid) return;


    const postData = {
      email: email,
      password: password,
    };
    axios.post(`${API_URL}login`,postData)
    .then(response => {
      console.log(response.success);

      // Suponiendo que la API devuelve 'success', 'token' y 'role'
      if (response.data.success) {
        const { token, role, nombre, id_estudiante, id_representante, id_empresa } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('id_estudiante', id_estudiante ?? '');
        localStorage.setItem('id_representante', id_representante ?? '');
        localStorage.setItem('id_empresa', id_empresa ?? '');
        onLogin(role);

        if (role === 'estudiante') {
          window.location.href = '/VistaEstudiante';
        } else if(role === 'docente'){
            window.location.href = '/VistaDocente';
          }else if(role === 'administrador'){
            window.location.href = '/VistaAdministrador';
          }else{
            setErrorMessage('Rol no autorizado');
          }
      } else {
        setErrorMessage('Login incorrecto'); // Solo mostrar si la respuesta no tiene éxito
      }
    })
    .catch(err =>{
      setErrorMessage('Ocurrió un error al intentar iniciar sesión');
    })
  };


  return (
    <div
      className="login-background container-fluid p-0 m-0"
      style={{
        backgroundImage: 'url("./src/assets/imagen.jpg")',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}
    >
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="bg-light p-5 rounded" style={{ width: '400px' }}>
          <h2 className="text-center">Iniciar Sesión</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                name='Email'
              />
              {emailError && <div className="text-danger">{emailError}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                name='Password'
              />
              {passwordError && <div className="text-danger">{passwordError}</div>}
            </div>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Button type="button" className="btn btn-primary w-100"onClick={handleInicio}>
              Iniciar Sesión
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}
