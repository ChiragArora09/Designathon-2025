import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { role, isLoggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!isLoggedIn || role !== "Admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
