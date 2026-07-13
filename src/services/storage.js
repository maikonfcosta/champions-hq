import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const memoryCache = {};

class StorageService {
  constructor() {
    this.syncStatus = 'idle';
    this.listeners = [];
  }

  onSyncStatusChange(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  }

  _notifyStatus(status) {
    this.syncStatus = status;
    this.listeners.forEach(l => l(status));
  }

  set(key, data) {
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
  }

  async setWithSync(key, data, user) {
    this.set(key, data);
    if (!user) return;
    this._notifyStatus('syncing');
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { [key]: data }, { merge: true });
      this._notifyStatus('synced');
    } catch (e) {
      console.error("Sync error:", e);
      this._notifyStatus('error');
    }
  }

  get(key, defaultValue = null) {
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
  }

  async getWithSync(key, user, defaultValue = null) {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data()[key] !== undefined) {
          const cloudData = snap.data()[key];
          this.set(key, cloudData); // also saves to local cache
          return cloudData;
        }
      } catch (e) {
        console.error("Error fetching cloud data", e);
      }
    }
    return this.get(key, defaultValue);
  }

  remove(key) {
    delete memoryCache[key];
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("Local storage error:", e);
    }
  }
}

export const storage = new StorageService();
