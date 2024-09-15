import React from 'react';
import './footer.css';
import insta from '../assets/instaimg.png';
import youtube from '../assets/youtubeimg.png';
import linkedin from '../assets/linkedinimg.png';
import facebook from '../assets/facebookimg.png';
import logoALPHA from '../assets/logoALPHA.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo de la empresa en la parte inferior izquierda */}
                <div className="logo">
                    <img src={logoALPHA} alt="AlphaCode Logo" />
                </div>

                {/* Redes sociales en la parte inferior derecha */}
                <div className="socialmedia">
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={insta} alt="Instagram" />
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src={youtube} alt="YouTube" />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src={linkedin} alt="LinkedIn" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={facebook} alt="Facebook" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
