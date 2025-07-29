import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Início</Link>
      <Link to="/paciente">Pacientes</Link>
      <Link to="/agenda">Agenda</Link>
    </nav>
  );
};

export default Navbar;
