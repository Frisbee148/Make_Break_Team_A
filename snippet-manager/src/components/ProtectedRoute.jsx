import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- DEVELOPMENT BYPASS ---
// Set this to true to bypass login and go straight to the app.
// !! IMPORTANT: Set this back to false before deploying to production.
const DEV_BYPASS = true;
// --------------------------

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If the bypass flag is on, always show the app
  if (DEV_BYPASS) {
    return children;
  }

  // This is the original logic that will run in production
  if (!currentUser) {
    // If no user, redirect to login
    return <Navigate to="/login" />;
  }

  // If user exists, show the main app
  return children;
};

export default ProtectedRoute;