import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!isLoggedIn) return null;

   return (
    <motion.nav
      className="navbar"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-right">
        <span className="admin-info">👤 {username}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
