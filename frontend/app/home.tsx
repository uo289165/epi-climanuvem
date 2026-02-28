import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const handleLogout = () => {
    // Navigate back to the login screen and clear history
    router.replace('/');
  };


  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>¡Bienvenido!</ThemedText>
        <ThemedText style={styles.subtitle}>Has iniciado sesión correctamente.</ThemedText>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  videoContainer: {
    width: '100%',
    height: 220, // Altura fija para el video
    borderRadius: 12, // Bordes redondeados
    overflow: 'hidden', // Asegura que las esquinas del video se recorten
    marginBottom: 40, // Espacio hasta el botón de logout
    backgroundColor: '#000', // Fondo negro mientras carga
  },
  video: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
