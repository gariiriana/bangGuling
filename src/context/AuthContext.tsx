import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type UserRole = 'customer' | 'driver' | 'owner';

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
}

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch additional data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || userData.displayName || '',
            role: userData.role as UserRole,
            photoURL: firebaseUser.photoURL || userData.photoURL,
            phone: userData.phone,
          });
        } else {
          // If user doc doesn't exist, create a default customer profile
          const defaultUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || '',
            role: 'customer',
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...defaultUser,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          setUser(defaultUser);
        }
        setFirebaseUser(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
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
      alert(error.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // User data will be set by onAuthStateChanged listener
      return true;
    } catch (error: any) {
      console.error('Login error:', error);

      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        alert('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
      } else if (error.code === 'auth/wrong-password') {
        alert('Password salah. Silakan coba lagi.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Format email tidak valid.');
      } else if (error.code === 'auth/invalid-credential') {
        alert('Email atau password salah.');
      } else {
        alert(error.message || 'Login gagal');
      }
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
