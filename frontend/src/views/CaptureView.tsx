import React from 'react';
import { View, TouchableOpacity, Text, ScrollView, Switch } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getCaptureViewStyles } from '@/src/styles/globalStyles';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader } from '@/components/ui/AppHeader';
import { StatusModal } from '@/components/ui/StatusModal';
import { useTranslation } from 'react-i18next';

interface CaptureViewProps {
  readonly controller: {
    readonly handleCameraCapture: () => void;
    readonly handleGallerySelection: () => void;
    readonly modalVisible: boolean;
    readonly modalConfig: {
      type: 'loading' | 'success' | 'error' | 'info' | 'confirm';
      title: string;
      message: string;
      onClose?: () => void;
      onCancel?: () => void;
    };
    readonly hideModal: () => void;
    readonly includeExplainability: boolean;
    readonly setIncludeExplainability: (value: boolean) => void;
  };
}

export function CaptureView({ controller }: CaptureViewProps) {
  const { 
    handleCameraCapture, 
    handleGallerySelection,
    modalVisible,
    modalConfig,
    hideModal,
    includeExplainability,
    setIncludeExplainability
  } = controller;

  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = getCaptureViewStyles(theme);

  return (
    <View style={styles.container}>
      <AppHeader title={t('capture.analyze')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="cloud-upload-outline" size={80} color={theme.colors.primary} />
          </View>
        </View>

        <ThemedText style={styles.subtitle}>
          {t('capture.subtitle')}
        </ThemedText>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleCameraCapture} 
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : '#E3F2FD' }]}>
              <Ionicons name="camera" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{t('capture.title')}</Text>
              <Text style={styles.optionDescription}>{t('capture.cameraDesc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={handleGallerySelection} 
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'dark' ? 'rgba(156, 39, 176, 0.1)' : '#F3E5F5' }]}>
              <Ionicons name="image" size={32} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>{t('capture.gallery')}</Text>
              <Text style={styles.optionDescription}>{t('capture.galleryDesc')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.mode === 'dark' ? '#CE93D8' : '#9C27B0'} />
          </TouchableOpacity>
        </View>

        <View style={[styles.optionCard, { paddingVertical: 12, marginTop: 16, flexDirection: 'column', alignItems: 'stretch' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconCircle, { backgroundColor: theme.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : '#FFF3E0', width: 40, height: 40, marginRight: 12 }]}>
                <Ionicons name="eye" size={20} color="#FF9800" />
              </View>
              <View>
                <Text style={[styles.optionTitle, { fontSize: 16 }]}>{t('capture.explainabilityName')}</Text>
                <Text style={[styles.optionDescription, { fontSize: 12 }]}>{t('capture.explainability')}</Text>
              </View>
            </View>
            <Switch
              value={includeExplainability}
              onValueChange={setIncludeExplainability}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
          {includeExplainability && (
            <View style={{ marginTop: 12, padding: 8, backgroundColor: theme.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : '#FFEBEE', borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="warning" size={16} color={theme.colors.danger} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.colors.danger, fontSize: 11, flex: 1 }}>
                {t('capture.explainabilityWarning')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} style={{marginRight: 8}} />
          <Text style={styles.infoText}>{t('capture.formatInfo')}</Text>
        </View>
      </ScrollView>

      <StatusModal 
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={modalConfig.onClose || hideModal}
        onCancel={modalConfig.onCancel || hideModal}
      />
    </View>
  );
}


