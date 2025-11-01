import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // If user exists, show the main app
};

export default ProtectedRoute;