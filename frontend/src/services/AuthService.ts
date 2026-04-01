import { auth } from '@/src/config/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInAnonymously,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth';
import type { User, AuthResponse } from '@/src/models/User';

// Convierte un FirebaseUser al modelo local User
const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
  uid: fbUser.uid,
  displayName: fbUser.displayName ?? undefined,
  email: fbUser.email ?? '',
  isAnonymous: fbUser.isAnonymous,
});

export const AuthService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!credential.user.emailVerified) {
        await signOut(auth);
        return { success: false, error: 'auth/email-not-verified' };
      }

      return { success: true, user: mapFirebaseUser(credential.user) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: username });
      
      // Update the user object to include the new displayName immediately
      const updatedUser = { ...credential.user, displayName: username } as FirebaseUser;
      
      // Enviar correo de verificación
      await sendEmailVerification(credential.user);
      
      // Cerrar sesión inmediatamente para requerir verificación antes de usar
      await signOut(auth);

      return { success: true, user: mapFirebaseUser(updatedUser) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  onAuthChange: (callback: (user: User | null) => void): Unsubscribe => {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(fbUser ? mapFirebaseUser(fbUser) : null);
    });
  },

  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return { success: true, user: mapFirebaseUser(userCredential.user) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  loginAnonymously: async (): Promise<AuthResponse> => {
    try {
      const credential = await signInAnonymously(auth);
      return { success: true, user: mapFirebaseUser(credential.user) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  updateUserName: async (newName: string): Promise<AuthResponse> => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      await updateProfile(auth.currentUser, { displayName: newName });
      
      const updatedUser = { ...auth.currentUser, displayName: newName } as FirebaseUser;
      return { success: true, user: mapFirebaseUser(updatedUser) };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },

  deleteAccount: async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!auth.currentUser) throw new Error('No user logged in');
      await deleteUser(auth.currentUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.code ?? 'Error desconocido' };
    }
  },
};
