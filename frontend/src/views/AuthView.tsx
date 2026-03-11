import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

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
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>
        
        <TextInput
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
            textContentType="password"
            autoComplete="password"
            importantForAutofill="yes"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
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
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonGoogle, loading && styles.buttonDisabled]} 
          onPress={() => promptAsync()}
          disabled={loading}
        >
          <Ionicons name="logo-google" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Continuar con Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetText}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={handleNavigateToRegister}
          disabled={loading}
        >
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
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
  buttonGoogle: {
    backgroundColor: '#db4437',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
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
  resetButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 5,
  },
  resetText: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
