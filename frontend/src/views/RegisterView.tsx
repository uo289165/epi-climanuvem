import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
    confirmPasswordInputRef
  } = controller;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Crear Cuenta</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
          maxLength={20}
        />

        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          importantForAutofill="yes"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          submitBehavior="submit"
          editable={!loading}
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            ref={passwordInputRef}
            style={styles.passwordInput}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            submitBehavior="submit"
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={togglePasswordVisibility}
            disabled={loading}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            ref={confirmPasswordInputRef}
            style={styles.passwordInput}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            submitBehavior="submit"
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={toggleConfirmPasswordVisibility}
            disabled={loading}
          >
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={handleNavigateToLogin}
          disabled={loading}
        >
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 15,
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  linkText: {
    color: '#0a7ea4',
    fontSize: 14,
    fontWeight: '600',
  },
});
