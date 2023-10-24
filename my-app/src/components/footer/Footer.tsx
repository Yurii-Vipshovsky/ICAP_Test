import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <p>Оце відбір!</p>
        </div>
        <div className="footer-contact">
          <p>Контакти:</p>
          <p>Email: vip.cool.ua@gmail.com</p>
          <p>Телефон: +380958962778</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;