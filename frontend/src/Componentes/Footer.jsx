// src/Componentes/Footer.jsx
import React from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from 'react-icons/fa';
import './Footer.css';
import logo from '../assets/logoALPHA.png';

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo-container">
        <img src={logo} alt="Logo de la Empresa" className="company-logo" />
      </div>
      <div className="social-icons">
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon" />
        </a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="icon" />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="icon" />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
