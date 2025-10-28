import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/images/logo.png";
import { Home, Users, Calendar, LogOut, HeartPulse, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de logout
    navigate('/');
  };

  return (
    <div id="navContainer">
      <div id="logoNav">
        <div class="iconNav"><img src={logo} alt="logo reduzida da dent.FY" /></div>
      </div>
      <nav className="navbar">
        <div id='links'>
          <Link to="/main"><Home size={24} class="iconNav"/><span>Início</span></Link>
          <Link to="/main/pacientes"><Users size={24} class="iconNav"/><span>Pacientes</span></Link>
          <Link to="/main/agenda"><Calendar size={24} class="iconNav"/><span>Agenda</span></Link>
          <Link to="/main/estoque"><Calendar size={24} class="iconNav"/><span>Estoque</span></Link>
        </div>
        <div id="btnUserOptions">
          <User size={24} class="iconNav"/><span>Minha conta</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={24}/><span>Sair</span>
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
