import React, { useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface AuthViewProps {
  readonly controller: {
    readonly user: string;
    readonly setUser: (val: string) => void;
    readonly password: string;
    readonly setPassword: (val: string) => void;
    readonly handleLogin: () => void;
  };
}

export function AuthView({ controller }: AuthViewProps) {
  const { user, setUser, password, setPassword, handleLogin } = controller;
  const passwordInputRef = useRef<TextInput>(null);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#888"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
          autoComplete="username"
          importantForAutofill="yes"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          submitBehavior="submit"
        />
        
        <TextInput
          ref={passwordInputRef}
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          importantForAutofill="yes"
          returnKeyType="done"
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
