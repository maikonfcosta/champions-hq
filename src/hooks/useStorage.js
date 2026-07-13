import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const memoryCache = {};

export function useStorage() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState('idle');

  // Grava localmente e no Firebase (se logado)
  const setItem = async (key, data, sync = true) => {
    // 1. Cache e LocalStorage
    memoryCache[key] = data;
    try {
      if (typeof data === 'object' && data !== null) {
        localStorage.setItem(key, JSON.stringify(data));
      } else {
        localStorage.setItem(key, String(data));
      }
    } catch (e) {
      console.warn("Local storage error:", e);
    }

    // 2. Cloud Sync
    if (sync && user) {
      setSyncStatus('syncing');
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { [key]: data }, { merge: true });
        setSyncStatus('synced');
      } catch (e) {
        console.error("Sync error:", e);
        setSyncStatus('error');
      }
    }
  };

  // Carrega do Firebase (se logado), faz fallback pro LocalStorage
  const getItem = async (key, defaultValue = null) => {
    // Tenta Nuvem primeiro se estiver logado
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data()[key] !== undefined) {
          const cloudData = snap.data()[key];
          memoryCache[key] = cloudData;
          // Sincroniza local para offline
          if (typeof cloudData === 'object' && cloudData !== null) {
            localStorage.setItem(key, JSON.stringify(cloudData));
          } else {
            localStorage.setItem(key, String(cloudData));
          }
          return cloudData;
        }
      } catch (e) {
        console.error("Error fetching cloud data", e);
      }
    }

    // Fallback Local
    return getLocalItem(key, defaultValue);
  };

  // Leitura síncrona imediata (apenas cache/local)
  const getLocalItem = (key, defaultValue = null) => {
    if (memoryCache[key] !== undefined) return memoryCache[key];
    try {
      const local = localStorage.getItem(key);
      if (local !== null) {
        try {
          const parsed = JSON.parse(local);
          memoryCache[key] = parsed;
          return parsed;
        } catch {
          memoryCache[key] = local;
          return local;
        }
      }
    } catch (e) {
      console.warn("Local storage error:", e);
    }
    return defaultValue;
  };

  const removeItem = (key) => {
    delete memoryCache[key];
    localStorage.removeItem(key);
    // Nota: remoção na nuvem não está implementada por padrão para segurança, 
    // poderia adicionar deleteField se necessário.
  };

  return { setItem, getItem, getLocalItem, removeItem, syncStatus };
}
