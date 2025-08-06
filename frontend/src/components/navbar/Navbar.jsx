import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de logout
    navigate('/');
  };

  return (
    <div id="navContainer">
      <nav className="navbar">
        <Link to="/main">Início</Link>
        <Link to="/main/pacientes">Pacientes</Link>
        <Link to="/main/agenda">Agenda</Link>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
