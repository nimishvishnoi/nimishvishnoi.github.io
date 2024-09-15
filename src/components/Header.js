import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 p-4 text-white">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-2xl">Nimish Vishnoi</h1>
        <div>
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/projects" className="mr-4">Projects</Link>
          <Link to="/experience">Experience</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
