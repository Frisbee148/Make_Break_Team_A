import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password) => {
    // Step A: Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step B: Create their personal space in Firestore
    const spaceRef = doc(db, "spaces", `personal_${user.uid}`);
    await setDoc(spaceRef, {
      name: "My Personal Space",
      ownerId: user.uid,
      members: [user.uid],
      isPersonal: true,
      createdAt: serverTimestamp()
    });

    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  // --- ADD THIS BYPASS FUNCTION ---
  const bypassLogin = () => {
    // This creates a "mock" user object
    // The UID is critical, as our app uses it to fetch data
    const mockUser = {
      uid: "DEV_USER_UID", // A fake ID
      email: "dev@user.com"
    };
    setCurrentUser(mockUser);
  };
  // ---------------------------------

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
    logout,
    bypassLogin // <-- ADD THIS
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};