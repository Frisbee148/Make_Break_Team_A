import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase'; // We still need 'auth' for login/logout
// 1. IMPORT YOUR NEW API FUNCTION
import { registerUser } from '../api/serverApi';
// 2. WE NO LONGER NEED FIRESTORE HERE
//    (Remove imports for db, doc, setDoc, serverTimestamp)

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    // Login is fine, it just gets a token
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 3. THIS IS THE NEW SIGNUP FUNCTION
  const signup = async (email, password) => {
    // Step A: Call our new backend route
    await registerUser(email, password);

    // Step B: After registration, log the user in
    // to get their session and ID token.
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  // ... (useEffect and the rest of the file are the same) ...
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
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