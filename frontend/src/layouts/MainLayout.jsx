import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Header from '../components/header/Header';
import './MainLayout.css';
import FloatingActions from "../components/atalhos/FloatingActions.jsx";

function MainLayout() {
  return (
    <div className="appLayout">
      <FloatingActions />
      <Navbar />
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
