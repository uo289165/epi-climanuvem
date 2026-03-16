import React from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AuthInput } from '@/components/ui/AuthInput';
import { AuthButton } from '@/components/ui/AuthButton';
import { AppHeader } from '@/components/ui/AppHeader';
import { StatusModal } from '@/components/ui/StatusModal';

interface RegisterViewProps {
  readonly controller: {
    readonly username: string;
    readonly setUsername: (val: string) => void;
    readonly email: string;
    readonly setEmail: (val: string) => void;
    readonly password: string;
    readonly setPassword: (val: string) => void;
    readonly confirmPassword: string;
    readonly setConfirmPassword: (val: string) => void;
    readonly showPassword: boolean;
    readonly togglePasswordVisibility: () => void;
    readonly showConfirmPassword: boolean;
    readonly toggleConfirmPasswordVisibility: () => void;
    readonly loading: boolean;
    readonly handleRegister: () => void;
    readonly handleNavigateToLogin: () => void;
    readonly emailInputRef: React.RefObject<TextInput | null>;
    readonly passwordInputRef: React.RefObject<TextInput | null>;
    readonly confirmPasswordInputRef: React.RefObject<TextInput | null>;
    readonly modalVisible: boolean;
    readonly modalConfig: {
      type: 'loading' | 'success' | 'error' | 'info';
      title: string;
      message: string;
      onClose?: () => void;
    };
    readonly hideModal: () => void;
  };
}

export function RegisterView({ controller }: RegisterViewProps) {
  const { 
    username, 
    setUsername, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword, 
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    loading, 
    handleRegister, 
    handleNavigateToLogin,
    emailInputRef,
    passwordInputRef,
    confirmPasswordInputRef,
    modalVisible,
    modalConfig,
    hideModal
  } = controller;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <AppHeader onBack={handleNavigateToLogin} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.headerSection}>
          <ThemedText type="title" style={styles.title}>Crear Cuenta</ThemedText>
          <ThemedText style={styles.subtitle}>Únete al Observatorio para empezar a gestionar datos climáticos.</ThemedText>
        </View>
        
        <View style={styles.formContainer}>
          <AuthInput
            icon="person-outline"
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
            maxLength={20}
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
          />

          <AuthInput
            ref={emailInputRef}
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
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          />

          <AuthInput
            ref={confirmPasswordInputRef}
            icon="shield-checkmark-outline"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            showEyeIcon
            onEyePress={toggleConfirmPasswordVisibility}
            editable={!loading}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />
          
          <AuthButton 
            title="Registrarse" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginLink}>
            <Text style={styles.alreadyHaveAccountText}>¿Ya tienes cuenta? </Text>
            <Text style={styles.linkText} onPress={handleNavigateToLogin}>Inicia sesión</Text>
          </View>
        </View>
      </ScrollView>

      <StatusModal 
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={modalConfig.onClose || hideModal}
      />
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
    marginTop: 10,
    marginBottom: 30,
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
  registerButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  alreadyHaveAccountText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
