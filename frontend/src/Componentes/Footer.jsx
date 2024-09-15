// src/Componentes/Footer.jsx
import React from 'react';
import { FaTwitter, FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from 'react-icons/fa'; // Cambia FaXing a FaTwitter
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="social-icons">
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> {/* Enlace corregido */}
          <FaTwitter className="icon" /> {/* Cambiado a FaTwitter */}
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
