import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Seu navegador bloqueou a janela de login (Popup). Por favor, permita popups para este site ou clique novamente no botão para tentar via redirecionamento.");
        signInWithRedirect(auth, googleProvider);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuário fechou o popup
      } else {
        // Erros de Cross-Origin (COOP) comuns no PC ou outros erros
        console.log("Tentando login via redirecionamento devido a erro no popup...");
        signInWithRedirect(auth, googleProvider);
      }
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
