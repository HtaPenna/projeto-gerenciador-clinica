import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Bolt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';


const Header = () => {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('UserName');
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { pageTitle } = usePageTitle();
  const { getUser, clearAuth } = useAuth();

  //busca nome de usuario
  useEffect(() => {
    const name = getUser()?.name || 'UserName';
    setUserName(name);
  }, []);

  // Fecha o dropdown se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      clearAuth();
      navigate("/");
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  return (
    <div id="headerContainer">
      <div id="headerTitle">
        <span>{pageTitle}</span>
      </div>

      <div className='divUser' ref={menuRef}>
        <div className='userName'>
          <span>{userName}</span>
        </div>

        <div className="btnUser" onClick={() => setOpen(!open)}>
          <User size={20} className="iconUser" />
        </div>

        {open && (
          <div className="userDropdown">
            <p className="dropdownUsername">{userName}</p>

            <div className='dropdownOptions'>
              <a href="#" className="dropdownLink">
                <Bolt size={16} />
                <span>Dados pessoais</span>
              </a>

              <button className="dropdownLogout" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
