import { createContext, useEffect, useState } from 'react';
// We now import our *own* API functions
import { registerUser, loginUser, getMe } from '../api/serverApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs ONCE when the app loads
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // 1. Get user data from our backend
          const userData = await getMe(); 
          // 2. Set the user
          setCurrentUser(userData);
        } catch (error) {
          // Token is invalid or expired
          console.error("Session invalid:", error);
          localStorage.removeItem('authToken');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    
    checkUser();
  }, []);

  const login = async (email, password) => {
    // 1. Call our server's login route
    const { token } = await loginUser(email, password);
    // 2. Save the token
    localStorage.setItem('authToken', token);
    // 3. Get the user data
    const userData = await getMe();
    // 4. Set the user
    setCurrentUser(userData);
  };

  const signup = async (email, password) => {
    // 1. Call our server's register route
    await registerUser(email, password);
    // 2. Immediately log them in
    await login(email, password);
  };

  const logout = () => {
    // 1. Clear the token
    localStorage.removeItem('authToken');
    // 2. Clear the user
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};