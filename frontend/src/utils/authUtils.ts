export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Traduce los códigos de error de Firebase a mensajes en español y amigables.
 */
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'El formato del correo electrónico no es válido.';
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo electrónico.';
    case 'auth/wrong-password':
      return 'La contraseña es incorrecta.';
    case 'auth/invalid-credential':
      return 'Credenciales incorrectas. Revisa tu correo y contraseña.';
    case 'auth/missing-email':
      return 'Falta el correo electrónico.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Inténtalo de nuevo más tarde.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada.';
    case 'auth/email-not-verified':
      return 'Debes verificar tu correo electrónico antes de iniciar sesión. Por favor, revisa tu bandeja de entrada y carpeta de spam.';
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está en uso por otra cuenta.';
    case 'auth/operation-not-allowed':
      return 'La creación de cuentas con correo y contraseña no está habilitada.';
    case 'auth/weak-password':
      return 'La contraseña es demasiado débil (debe tener al menos 6 caracteres).';
    case 'auth/password-does-not-meet-requirements':
      return 'La contraseña debe contener al menos una letra mayúscula y un número.';
    default:
      return `Error de autenticación: ${errorCode}`;
  }
}
