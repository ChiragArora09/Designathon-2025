import { Outlet } from 'react-router-dom';
import Sidebar from '../admin-sidebar/AdminSidebar';
import './AdminDashboard.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
