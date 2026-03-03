// Servicio de ejemplo

export const AuthService = {
    login: async (email: string, pass: string): Promise<{ success: boolean; token?: string; error?: string }> => {
      console.log('API Call: Login attempt:', { email, pass });
      // Simulate API lag
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, token: 'fake-jwt-token' }), 500));
    },
    
    register: async (name: string, email: string, pass: string): Promise<{ success: boolean; token?: string; error?: string }> => {
      console.log('API Call: Sign up attempt:', { name, email, pass });
      return new Promise((resolve) => setTimeout(() => resolve({ success: true, token: 'fake-jwt-token-new' }), 500));
    }
  };
