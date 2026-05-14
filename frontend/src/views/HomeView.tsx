import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getHomeViewStyles } from '@/src/styles/globalStyles';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTranslation } from 'react-i18next';
import { HistoryModal } from '@/components/ui/HistoryModal';
import { AnalysisHistoryItem } from '@/src/services/AnalysisService';

interface HomeViewProps {
    readonly controller: {
    readonly handleLogout: () => void;
    readonly handleNavigateToCapture: () => void;
    readonly handleNavigateToProfile: () => void;
    readonly historyModalVisible: boolean;
    readonly history: AnalysisHistoryItem[];
    readonly loadingHistory: boolean;
    readonly loadHistory: (forceRefresh?: boolean) => void;
    readonly closeHistoryModal: () => void;
    readonly initialSelectedAnalysisId?: string | null;
    readonly userName: string;
  };
}

export function HomeView({ controller }: HomeViewProps) {
  const { 
    handleLogout, 
    handleNavigateToCapture,
    handleNavigateToProfile,
    historyModalVisible,
    history,
    loadingHistory,
    loadHistory,
    closeHistoryModal,
    initialSelectedAnalysisId,
    userName
  } = controller;

  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getHomeViewStyles(theme);

  return (
    <View style={styles.container}>
      <AppHeader title={t('home.title')} showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          style={styles.welcomeCard}
          onPress={handleNavigateToProfile}
          activeOpacity={0.7}
        >
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.welcomeTextContainer}>
              <ThemedText type="title" style={styles.title}>{t('home.welcome')}</ThemedText>
              <ThemedText style={styles.subtitle}>{userName}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.border} />
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={handleNavigateToCapture}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
            <Ionicons name="camera" size={28} color={theme.colors.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{t('home.analyzeImage')}</Text>
            <Text style={styles.actionDescription}>{t('home.analyzeDesc')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => loadHistory()}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.1)' : '#F3E5F5' }]}>
            <Ionicons name="list" size={28} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{t('home.history')}</Text>
            <Text style={styles.actionDescription}>{t('home.historyDesc')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.logoutCard]} onPress={handleLogout}>
          <View style={[styles.iconContainer, { backgroundColor: theme.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE' }]}>
            <Ionicons name="log-out" size={28} color={theme.colors.danger} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: theme.colors.danger }]}>{t('home.logout')}</Text>
            <Text style={styles.actionDescription}>{t('home.logoutDesc')}</Text>
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
    </View>
  );
}


