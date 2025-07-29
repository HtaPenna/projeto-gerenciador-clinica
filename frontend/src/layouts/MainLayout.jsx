import React from 'react';
import Navbar from './../components/navbar/Navbar.jsx';

const MainLayout = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="main-content">{children}</main>
    </>
  );
};

export default MainLayout;
