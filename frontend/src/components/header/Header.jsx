import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div id="headerContainer">
      <div id="headerTitle">
        <span>PageTitle</span>
      </div>
      <div id="searchBar">
        <input type="text" placeholder='SearchBar sem lógica'/>
      </div>
    </div>
  );
};

export default Header;