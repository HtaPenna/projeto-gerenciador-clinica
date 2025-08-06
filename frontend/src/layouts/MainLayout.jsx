import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="appLayout">
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
