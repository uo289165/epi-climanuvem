import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { HistoryModal } from '@/components/ui/HistoryModal';
import { StatusModal, ModalType } from '@/components/ui/StatusModal';
import { AnalysisHistoryItem } from '@/src/services/AnalysisService';

interface HomeViewProps {
  readonly controller: {
    readonly handleLogout: () => void;
    readonly handleNavigateToCapture: () => void;
    readonly handleNavigateToProfile: () => void;
    readonly handleTestBackend: () => void;
    readonly closeModal: () => void;
    readonly historyModalVisible: boolean;
    readonly modalVisible: boolean;
    readonly modalType: ModalType;
    readonly modalTitle: string;
    readonly modalMessage: string;
    readonly history: AnalysisHistoryItem[];
    readonly loadingHistory: boolean;
    readonly loadHistory: (forceRefresh?: boolean) => void;
    readonly closeHistoryModal: () => void;
    readonly userName: string;
    readonly isGuest: boolean;
  };
}

export function HomeView({ controller }: HomeViewProps) {
  const { 
    handleLogout, 
    handleNavigateToCapture,
    handleNavigateToProfile,
    handleTestBackend,
    closeModal,
    historyModalVisible,
    modalVisible,
    modalType,
    modalTitle,
    modalMessage,
    history,
    loadingHistory,
    loadHistory,
    closeHistoryModal,
    userName,
    isGuest
  } = controller;

  return (
    <View style={styles.container}>
      <AppHeader title="Inicio" showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.welcomeCard}
          onPress={handleNavigateToProfile}
          disabled={isGuest}
          activeOpacity={0.7}
        >
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color="#007AFF" />
            </View>
            <View style={styles.welcomeTextContainer}>
              <ThemedText type="title" style={styles.title}>¡Bienvenido!</ThemedText>
              <ThemedText style={styles.subtitle}>{userName}</ThemedText>
            </View>
            {!isGuest && (
              <Ionicons name="chevron-forward" size={24} color="#CCC" />
            )}
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.actionCard} onPress={() => loadHistory()}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="list" size={28} color="#9C27B0" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Historial</Text>
            <Text style={styles.actionDescription}>Revisa tus análisis anteriores</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleTestBackend}>
          <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="flask" size={28} color="#4CAF50" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Probar Backend</Text>
            <Text style={styles.actionDescription}>Verificar conexión con el servidor</Text>
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

      <HistoryModal 
        visible={historyModalVisible}
        onClose={closeHistoryModal}
        history={history}
        loading={loadingHistory}
        onRefresh={() => loadHistory(true)}
      />

      <StatusModal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
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
  welcomeTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#007AFF',
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
