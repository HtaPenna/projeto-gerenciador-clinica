import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/images/logo.png";
import { Home, Users, Calendar, ClipboardCheck, Package } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/main') {
      return location.pathname === '/main' || location.pathname === '/main/';
    } else {
      return location.pathname.startsWith(path);
    }
  };

  return (
    <div id="navContainer">
      <div id="logoNav">
        <div className="iconNav"><img src={logo} alt="logo reduzida da dent.FY" /></div>
      </div>
      <nav className="navbar">
        <div id='links'>
          <Link to="/main" className={isActive('/main') ? 'nav-link active' : 'nav-link'}>
            <Home size={24} className="iconNav"/>
            <span>Início</span>
          </Link>
          <Link to="/main/pacientes" className={isActive('/main/pacientes') ? 'nav-link active' : 'nav-link'}>
            <Users size={24} className="iconNav"/>
            <span>Pacientes</span>
          </Link>
          <Link to="/main/agenda" className={isActive('/main/agenda') ? 'nav-link active' : 'nav-link'}>
            <Calendar size={24} className="iconNav"/>
            <span>Agenda</span>
          </Link>
          <Link to="/main/consultas" className={isActive('/main/consultas') ? 'nav-link active' : 'nav-link'}>
            <ClipboardCheck size={24} className="iconNav"/>
            <span>Consultas</span>
          </Link>
          <Link to="/main/estoque" className={isActive('/main/estoque') ? 'nav-link active' : 'nav-link'}>
            <Package size={24} className="iconNav"/>
            <span>Estoque</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
