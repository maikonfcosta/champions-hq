import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';

export function useCloudSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState(storage.syncStatus);

  useEffect(() => {
    const unsub = storage.onSyncStatusChange(setSyncStatus);
    return unsub;
  }, []);

  const syncDataToCloud = useCallback(async (key, data) => {
    return storage.setWithSync(key, data, user);
  }, [user]);

  const getCloudData = useCallback(async (key) => {
    return storage.getWithSync(key, user);
  }, [user]);

  return { syncStatus, syncDataToCloud, getCloudData };
}
