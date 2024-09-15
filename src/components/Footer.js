import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center">
      <p>© 2024 Nimish Vishnoi</p>
      <div className="flex justify-center mt-2">
        <a href="https://github.com/nimishvishnoi" className="mr-4"><FaGithub size={24} /></a>
        <a href="https://www.linkedin.com/in/nimishvishnoi/"><FaLinkedin size={24} /></a>
      </div>
    </footer>
  );
};

export default Footer;
