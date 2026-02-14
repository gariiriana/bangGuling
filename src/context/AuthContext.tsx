import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNotification } from './NotificationContext';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  getUserRole: () => UserRole | null;
  isOwner: () => boolean;
  isDriver: () => boolean;
  isCustomer: () => boolean;
  intendedPath: string | null;
  setIntendedPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        // Listen for user data changes in real-time
        const userRef = doc(db, 'users', firebaseUser.uid);

        // We use onSnapshot instead of getDoc to handle real-time updates
        // This is crucial for role changes (e.g. customer -> driver)
        onSnapshot(userRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            console.log('DEBUG: User updated:', userData);

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: userData.displayName || firebaseUser.displayName || '',
              role: userData.role as UserRole,
              photoURL: userData.photoURL || firebaseUser.photoURL,
              phone: userData.phone,
              address: userData.address,
            });
          } else {
            console.log('DEBUG: User doc missing, creating default');
            // Create default user if missing
            const defaultUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName || '',
              role: 'customer',
            };

            // Create the document (this will trigger snapshot again with exists=true)
            // ensure validation or security rules allow this
            setDoc(userRef, {
              ...defaultUser,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            setUser(defaultUser);
          }
          setLoading(false);
        }, (error) => {
          console.error('Snapshot error:', error);
          setLoading(false);
        });

      } else {
        // User is signed out
        setUser(null);
        setFirebaseUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName });

      // Create user document in Firestore
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        role,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setUser(userData);
      setFirebaseUser(firebaseUser);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      showNotification(error.message || 'Registration failed', 'error');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged listener logic
      return true;
    } catch (error: any) {
      console.error('Login error:', error);

      // User-friendly error messages
      let message = 'Login gagal';
      if (error.code === 'auth/user-not-found') {
        message = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Password salah. Silakan coba lagi.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Format email tidak valid.';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Email atau password salah.';
      } else {
        message = error.message || 'Login gagal';
      }
      showNotification(message, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  const isOwner = (): boolean => {
    return user?.role === 'owner';
  };

  const isDriver = (): boolean => {
    return user?.role === 'driver';
  };

  const isCustomer = (): boolean => {
    return user?.role === 'customer';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        getUserRole,
        isOwner,
        isDriver,
        isCustomer,
        intendedPath,
        setIntendedPath,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
