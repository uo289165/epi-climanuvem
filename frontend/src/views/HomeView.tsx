import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getHomeViewStyles } from '@/src/styles/globalStyles';
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
    readonly initialSelectedAnalysisId?: string | null;
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
    initialSelectedAnalysisId,
    userName,
    isGuest
  } = controller;

  const { theme } = useTheme();
  const styles = getHomeViewStyles(theme);

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
              <Ionicons name="person" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.welcomeTextContainer}>
              <ThemedText type="title" style={styles.title}>¡Bienvenido!</ThemedText>
              <ThemedText style={styles.subtitle}>{userName}</ThemedText>
            </View>
            {!isGuest && (
              <Ionicons name="chevron-forward" size={24} color={theme.colors.border} />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToCapture}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
            <Ionicons name="camera" size={28} color={theme.colors.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Analizar Imagen</Text>
            <Text style={styles.actionDescription}>Sube una foto de nubes para análisis</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => loadHistory()}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.1)' : '#F3E5F5' }]}>
            <Ionicons name="list" size={28} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Historial</Text>
            <Text style={styles.actionDescription}>Revisa tus análisis anteriores</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleTestBackend}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : '#E8F5E9' }]}>
            <Ionicons name="flask" size={28} color={theme.colors.success} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Probar Backend</Text>
            <Text style={styles.actionDescription}>Verificar conexión con el servidor</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.logoutCard]} onPress={handleLogout}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE' }]}>
            <Ionicons name="log-out" size={28} color={theme.colors.danger} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: theme.colors.danger }]}>Cerrar Sesión</Text>
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
        initialSelectedAnalysisId={initialSelectedAnalysisId}
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


