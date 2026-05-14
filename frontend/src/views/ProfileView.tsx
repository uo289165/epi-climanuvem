import React from 'react';
import { View, Text, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getProfileViewStyles } from '@/src/styles/globalStyles';
import { AppHeader } from '@/components/ui/AppHeader';
import { AuthButton } from '@/components/ui/AuthButton';
import { StatusModal, ModalType } from '@/components/ui/StatusModal';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/src/contexts/LanguageContext';

interface ProfileViewProps {
  controller: {
    userName: string;
    userEmail: string;
    newName: string;
    isGuest: boolean;
    setNewName: (name: string) => void;
    saving: boolean;
    deleting: boolean;
    showDeleteConfirm: boolean;
    handleUpdateName: () => void;
    confirmDeleteAccount: () => void;
    cancelDeleteAccount: () => void;
    proceedWithDelete: () => void;
    handleGoBack: () => void;
    modalVisible: boolean;
    modalType: ModalType;
    modalTitle: string;
    modalMessage: string;
    closeModal: () => void;
  };
}

const AppearanceSection = ({ theme, themeMode, setThemeMode, t, styles }: any) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{t('profile.appearance')}</Text>
    <Text style={styles.warningText}>
      {t('profile.appearanceDesc')}
    </Text>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity 
        style={[styles.themeButton, themeMode === 'light' && styles.themeButtonActive]} 
        onPress={() => setThemeMode('light')}
      >
        <Ionicons name="sunny-outline" size={18} color={themeMode === 'light' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, themeMode === 'light' && { color: theme.colors.primary }]}>{t('common.light')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.themeButton, themeMode === 'dark' && styles.themeButtonActive]} 
        onPress={() => setThemeMode('dark')}
      >
        <Ionicons name="moon-outline" size={18} color={themeMode === 'dark' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, themeMode === 'dark' && { color: theme.colors.primary }]}>{t('common.dark')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.themeButton, themeMode === 'system' && styles.themeButtonActive]} 
        onPress={() => setThemeMode('system')}
      >
        <Ionicons name="phone-portrait-outline" size={18} color={themeMode === 'system' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, themeMode === 'system' && { color: theme.colors.primary }]}>{t('common.system')}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LanguageSection = ({ theme, languageMode, setLanguageMode, t, styles }: any) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
    <Text style={styles.warningText}>
      {t('profile.languageDesc')}
    </Text>
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity 
        style={[styles.themeButton, languageMode === 'en' && styles.themeButtonActive]} 
        onPress={() => setLanguageMode('en')}
      >
        <Ionicons name="language-outline" size={18} color={languageMode === 'en' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, languageMode === 'en' && { color: theme.colors.primary }]}>{t('common.english')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.themeButton, languageMode === 'es' && styles.themeButtonActive]} 
        onPress={() => setLanguageMode('es')}
      >
        <Ionicons name="language-outline" size={18} color={languageMode === 'es' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, languageMode === 'es' && { color: theme.colors.primary }]}>{t('common.spanish')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.themeButton, languageMode === 'system' && styles.themeButtonActive]} 
        onPress={() => setLanguageMode('system')}
      >
        <Ionicons name="phone-portrait-outline" size={18} color={languageMode === 'system' ? theme.colors.primary : theme.colors.textSecondary} />
        <Text style={[styles.themeButtonText, languageMode === 'system' && { color: theme.colors.primary }]}>{t('common.system')}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DangerZoneSection = ({ confirmDeleteAccount, deleting, t, styles }: any) => (
  <View style={[styles.card, styles.dangerCard]}>
    <Text style={[styles.sectionTitle, styles.dangerText]}>{t('profile.dangerZone')}</Text>
    <Text style={styles.warningText}>
      {t('profile.dangerDesc')}
    </Text>
    <TouchableOpacity 
      style={styles.dangerButton} 
      onPress={confirmDeleteAccount}
      disabled={deleting}
    >
      <Ionicons name="trash-outline" size={20} color="white" />
      <Text style={styles.dangerButtonText}>{t('profile.deleteAccount')}</Text>
    </TouchableOpacity>
  </View>
);

const GuestInfoSection = ({ t, styles }: any) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{t('profile.guestPreferencesTitle')}</Text>
    <Text style={styles.warningText}>{t('profile.guestPreferencesDesc')}</Text>
  </View>
);

export function ProfileView({ controller }: Readonly<ProfileViewProps>) {
  const {
    userName,
    userEmail,
    newName,
    isGuest,
    setNewName,
    saving,
    deleting,
    showDeleteConfirm,
    handleUpdateName,
    confirmDeleteAccount,
    cancelDeleteAccount,
    proceedWithDelete,
    handleGoBack,
    modalVisible,
    modalType,
    modalTitle,
    modalMessage,
    closeModal,
  } = controller;

  const { theme, themeMode, setThemeMode } = useTheme();
  const { languageMode, setLanguageMode } = useLanguage();
  const { t } = useTranslation();
  const styles = getProfileViewStyles(theme);

  const trimmedName = newName.trim();
  const hasValidNameLength = trimmedName.length >= 3 && trimmedName.length <= 20;
  const hasNameChanged = trimmedName !== userName && hasValidNameLength;

  return (
    <View style={styles.container}>
      <AppHeader title={t('profile.title')} showBack={true} onBack={handleGoBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={theme.colors.primary} />
          </View>
          <ThemedText style={styles.emailText}>
            {isGuest ? userName : userEmail}
          </ThemedText>
        </View>

        {isGuest ? (
          <GuestInfoSection t={t} styles={styles} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{t('profile.username')}</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder={t('profile.usernamePlaceholder')}
              placeholderTextColor="#999"
            />
            <View style={styles.saveAction}>
              <AuthButton
                title={saving ? t('common.saving') : t('common.save')}
                onPress={handleUpdateName}
                variant="primary"
                disabled={!hasNameChanged || saving}
                textStyle={{ fontSize: 14 }}
                style={{ paddingVertical: 12, paddingHorizontal: 20 }}
              />
            </View>
          </View>
        )}

        <AppearanceSection theme={theme} themeMode={themeMode} setThemeMode={setThemeMode} t={t} styles={styles} />

        <LanguageSection theme={theme} languageMode={languageMode} setLanguageMode={setLanguageMode} t={t} styles={styles} />

        {!isGuest && (
          <DangerZoneSection confirmDeleteAccount={confirmDeleteAccount} deleting={deleting} t={t} styles={styles} />
        )}
      </ScrollView>

      {/* Modal de confirmación de borrado */}
      <Modal visible={showDeleteConfirm} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={40} color={theme.colors.danger} />
            </View>
            <Text style={styles.modalTitle}>{t('profile.deleteConfirmTitle')}</Text>
            <Text style={styles.modalBody}>
              {t('profile.deleteConfirmBody')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelDeleteAccount}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={proceedWithDelete}>
                <Text style={styles.confirmDeleteButtonText}>{t('profile.yesDelete')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
