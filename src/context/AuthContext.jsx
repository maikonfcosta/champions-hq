import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Checa se voltou de um redirecionamento com erro
    getRedirectResult(auth).catch((error) => {
      console.error("Erro após redirecionamento:", error);
      alert(`Falha no login por redirecionamento: ${error.message} (Código: ${error.code})`);
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
        alert("Seu navegador bloqueou a janela de login (Popup). Tentando via redirecionamento...");
        signInWithRedirect(auth, googleProvider);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Usuário fechou o popup
      } else if (error.code === 'auth/unauthorized-domain') {
        alert("Este domínio não está autorizado no Firebase Console. Adicione-o na lista de domínios permitidos.");
      } else {
        alert("Erro de autenticação: " + error.message + " (Código: " + error.code + ")");
        console.log("Tentando login via redirecionamento devido a erro no popup...");
        signInWithRedirect(auth, googleProvider).catch(err => {
          alert("Erro crítico no Firebase (Verifique as variáveis de ambiente): " + err.message);
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

export const useAuth = () => useContext(AuthContext);
