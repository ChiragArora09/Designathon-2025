import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!isLoggedIn) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
