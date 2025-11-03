import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="appLayout">
      <Navbar />
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
