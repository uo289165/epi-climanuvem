import { auth } from '@/src/config/firebaseConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import type { User, AuthResponse } from '@/src/models/User';

// Convierte un FirebaseUser al modelo local User
const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
  uid: fbUser.uid,
  displayName: fbUser.displayName ?? undefined,
  email: fbUser.email ?? '',
});

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: mapFirebaseUser(credential.user) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  onAuthChange: (callback: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? mapFirebaseUser(fbUser) : null);
    });
  },
};
