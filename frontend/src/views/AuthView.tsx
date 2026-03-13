import React from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AppHeader } from '@/components/ui/AppHeader';

interface AuthViewProps {
  readonly controller: {
    readonly email: string;
    readonly setEmail: (val: string) => void;
    readonly password: string;
    readonly setPassword: (val: string) => void;
    readonly showPassword: boolean;
    readonly togglePasswordVisibility: () => void;
    readonly loading: boolean;
    readonly handleLogin: () => void;
    readonly handleNavigateToRegister: () => void;
    readonly handleResetPassword: () => void;
    readonly passwordInputRef: React.RefObject<TextInput | null>;
    readonly promptAsync: () => void;
  };
}

export function AuthView({ controller }: AuthViewProps) {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    showPassword,
    togglePasswordVisibility,
    loading, 
    handleLogin, 
    handleNavigateToRegister,
    handleResetPassword,
    passwordInputRef,
    promptAsync
  } = controller;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <AppHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <ThemedText type="title" style={styles.title}>Bienvenido de nuevo</ThemedText>
          <ThemedText style={styles.subtitle}>Ingresa tus credenciales para acceder al panel de control.</ThemedText>
        </View>
        
        <View style={styles.formContainer}>
          <AuthInput
            icon="mail-outline"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
          
          <AuthInput
            ref={passwordInputRef}
            icon="lock-closed-outline"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            showEyeIcon
            onEyePress={togglePasswordVisibility}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          
          <AuthButton 
            title="Iniciar Sesión" 
            onPress={handleLogin} 
            loading={loading}
          />

          <AuthButton 
            title="Continuar con Google" 
            onPress={promptAsync} 
            variant="google"
            icon="logo-google"
            disabled={loading}
          />

          <View style={styles.actionsContainer}>
            <AuthButton 
              title="¿Olvidaste tu contraseña?" 
              onPress={handleResetPassword} 
              variant="outline"
              style={styles.resetButton}
              textStyle={styles.resetText}
              disabled={loading}
            />

            <View style={styles.registerLink}>
              <Text style={styles.noAccountText}>¿No tienes cuenta? </Text>
              <Text style={styles.linkText} onPress={handleNavigateToRegister}>Regístrate</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  actionsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resetButton: {
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    marginBottom: 20,
  },
  resetText: {
    fontSize: 15,
    textDecorationLine: 'underline',
    color: '#666',
    fontWeight: '500',
  },
  registerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noAccountText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
