import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { path: '/admin-dashboard', label: 'Dashboard 📂' },
    { path: '/admin-dashboard/mavericks', label: 'Mavericks 👤' },
    { path: '/admin-dashboard/batches', label: 'Batches 📦' },
    { path: '/admin-dashboard/learning-paths', label: 'Learning Paths 🧠' },
    { path: '/admin-dashboard/online-content', label: 'Online Content 🧾' },
    { path: '/admin-dashboard/offline-content', label: 'Offline Content 🧑🏻‍🏫' },
    { path: '/admin-dashboard/progress', label: 'Progress 📈' },
    { path: '/admin-dashboard/reports', label: 'Reports 📑' },
    { path: '/admin-dashboard/admin-tools', label: 'Admin Tools ⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.div 
      className="sidebar" 
      initial={{ x: -250 }} 
      animate={{ x: 0 }} 
      transition={{ duration: 0.6 }}
    >
      <div>
        <div className="sidebar-title">MaveriQ</div>
        <ul className="nav-list">
          {menu.map(item => (
            <motion.li 
              key={item.path} 
              className="nav-item"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
                end={item.path === '/admin-dashboard'}
              >
                {item.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="logout-section">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </motion.div>
  );
};

export default Sidebar;