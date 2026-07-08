import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useCloudSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState('idle');

  const syncDataToCloud = async (key, data) => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { [key]: data }, { merge: true });
      setSyncStatus('synced');
    } catch (e) {
      console.error("Sync error:", e);
      setSyncStatus('error');
    }
  };

  const getCloudData = async (key) => {
    if (!user) return null;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data()[key]) {
        return snap.data()[key];
      }
    } catch (e) {
      console.error("Error fetching cloud data", e);
    }
    return null;
  };

  return { syncStatus, syncDataToCloud, getCloudData };
}
