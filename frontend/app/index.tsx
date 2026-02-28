import { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  // Creamos una referencia para poder apuntar al campo de contraseña
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = () => {
    if (user === 'test' && password === '1234') {
        router.replace('/home');
    } else {
        setUser('');
        setPassword('');
        Alert.alert('Error', 'Credenciales incorrectas. (Usa test / 1234)');
    }
  };

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
          // Propiedades para autocompletar usuario/email:
          textContentType="username"
          autoComplete="username"
          importantForAutofill="yes"
          // Propiedades para saltar al siguiente campo:
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          submitBehavior="submit" // Evita que se cierre el teclado al enviar
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
