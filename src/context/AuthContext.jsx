import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa se voltou de um redirecionamento com erro
    getRedirectResult(auth).catch((error) => {
      console.error("Erro após redirecionamento:", error);
      toast.error(`Falha no login por redirecionamento: ${error.message}`);
    });

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
        toast.error("Popup bloqueado! Tentando redirecionamento...");
        signInWithRedirect(auth, googleProvider);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuário fechou o popup
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error("Domínio não autorizado no Firebase Console.");
      } else {
        toast.error(`Erro de autenticação: ${error.message}`);
        console.log("Tentando login via redirecionamento devido a erro no popup...");
        signInWithRedirect(auth, googleProvider).catch(err => {
          toast.error(`Erro crítico no Firebase: ${err.message}`);
        });
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
