# Firebase Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o Firebase Auth e Firestore para sincronizar os dados do usuário (tema, sfx e coleção) na nuvem, garantindo a permanência dos dados.

**Architecture:** A aplicação utilizará o `firebase/auth` com o provedor do Google para login. Será criado um contexto global `AuthContext` que proverá o estado do usuário. O Firebase Firestore armazenará as chaves que atualmente vivem no `localStorage` sob o nó `users/{uid}/dados`. O `App.jsx` e `Collection.jsx` serão atualizados para dar prioridade aos dados remotos se logado.

**Tech Stack:** React, Firebase, LocalStorage

---

### Task 1: Instalação e Setup do Firebase

**Files:**
- Modify: `package.json`
- Create: `src/services/firebase.js`
- Create: `.env`

- [ ] **Step 1: Instalar dependências**

```bash
npm install firebase
```

- [ ] **Step 2: Configurar variáveis de ambiente**

*(O desenvolvedor/usuário precisará preencher as chaves reais antes de prosseguir)*
```env
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

- [ ] **Step 3: Criar inicializador do Firebase**

```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

- [ ] **Step 4: Commit**

```bash
git add package.json src/services/firebase.js .env
git commit -m "feat: add firebase setup and dependencies"
```

---

### Task 2: Auth Context

**Files:**
- Create: `src/context/AuthContext.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Criar o provedor de Autenticação**

```javascript
// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

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

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 2: Prover o AuthContext em main.jsx**

```javascript
// src/main.jsx (substituir renderização)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
```

- [ ] **Step 3: Commit**

```bash
git add src/context/AuthContext.jsx src/main.jsx
git commit -m "feat: add global auth context"
```

---

### Task 3: Hook de Sincronização (Cloud Sync)

**Files:**
- Create: `src/hooks/useCloudSync.js`

- [ ] **Step 1: Criar lógica de Sync e Merge com Firestore**

```javascript
// src/hooks/useCloudSync.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function useCloudSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced

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
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data()[key]) {
      return snap.data()[key];
    }
    return null;
  };

  return { syncStatus, syncDataToCloud, getCloudData };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useCloudSync.js
git commit -m "feat: hook for firestore sync operations"
```

---

### Task 4: Integração de Login e Sync na UI (App.jsx)

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Atualizar Navbar e Configurações**
Importar `useAuth` em `App.jsx`, mostrar estado de login.

*(No App.jsx, adicionar o seguinte antes de return e nos imports)*
```javascript
import { useAuth } from './context/AuthContext';
import { useCloudSync } from './hooks/useCloudSync';
// ... dentro de App()
const { user, loginWithGoogle, logout } = useAuth();
const { syncStatus } = useCloudSync();

// Adicionar no Modal de Settings ou na Navbar o controle de Auth
```

*(No retorno do JSX da `navbar` / `nav-right` adicione antes do botão MobileMenu)*
```jsx
{user ? (
  <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px' }}>
    <span style={{ fontSize: '0.8rem', color: '#86efac' }}>{syncStatus === 'syncing' ? 'Salvando...' : 'Nuvem OK'}</span>
    <img src={user.photoURL} alt="User" style={{ width: 28, height: 28, borderRadius: '50%' }} title={user.displayName} />
    <button onClick={logout} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Sair</button>
  </div>
) : (
  <button onClick={loginWithGoogle} className="btn-primary desktop-only" style={{ marginRight: '16px', padding: '6px 12px' }}>
    Login
  </button>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: login button and sync indicator in navbar"
```

---

### Task 5: Refatorar Coleção para Usar Sync

**Files:**
- Modify: `src/pages/Collection.jsx`

- [ ] **Step 1: Integrar `useCloudSync` no `Collection.jsx`**
Ao carregar a página, se logado, buscar dados da nuvem. Ao salvar, escrever na nuvem e no LocalStorage.

```javascript
// imports de Collection.jsx
import { useAuth } from '../context/AuthContext';
import { useCloudSync } from '../hooks/useCloudSync';

// dentro de Collection()
const { user } = useAuth();
const { syncDataToCloud, getCloudData } = useCloudSync();

// no useEffect
useEffect(() => {
  const loadPacks = async () => {
    let saved = null;
    if (user) {
      saved = await getCloudData('mc_owned_packs');
    }
    if (!saved) {
      const local = localStorage.getItem('mc_owned_packs');
      if (local) {
        try { saved = JSON.parse(local); } catch { }
      }
    }
    if (saved) setOwnedPacks(saved);
    
    // ... buscar api logic igual antes
  };
  loadPacks();
}, [user]);

// No togglePack, após setOwnedPacks(updated) e localStorage.setItem
if (user) syncDataToCloud('mc_owned_packs', updated);

// No selectAll e deselectAll fazer a mesma adição de `syncDataToCloud` se existir usuário logado.
```

- [ ] **Step 2: Commit final e verificação de build**

```bash
npm run build
git add src/pages/Collection.jsx
git commit -m "feat: collection now syncs with firestore"
```
