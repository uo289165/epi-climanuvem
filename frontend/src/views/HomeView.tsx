import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';

interface HomeViewProps {
  readonly controller: {
    readonly handleLogout: () => void;
    readonly handleNavigateToCapture: () => void;
  };
}

export function HomeView({ controller }: HomeViewProps) {
  const { handleLogout, handleNavigateToCapture } = controller;

  return (
    <View style={styles.container}>
      <AppHeader title="Inicio" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color="#007AFF" />
            </View>
            <View>
              <ThemedText type="title" style={styles.title}>¡Bienvenido!</ThemedText>
              <ThemedText style={styles.subtitle}>Observatorio ClimaNuvem</ThemedText>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToCapture}>
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="camera" size={28} color="#007AFF" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Analizar Imagen</Text>
            <Text style={styles.actionDescription}>Sube una foto de nubes para análisis</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="list" size={28} color="#9C27B0" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Historial</Text>
            <Text style={styles.actionDescription}>Revisa tus análisis anteriores</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.logoutCard]} onPress={handleLogout}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
            <Ionicons name="log-out" size={28} color="#F44336" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: '#F44336' }]}>Cerrar Sesión</Text>
            <Text style={styles.actionDescription}>Salir de tu cuenta actual</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: '#6C757D',
  },
  logoutCard: {
    marginTop: 20,
    borderColor: '#FFEBEE',
  },
});
