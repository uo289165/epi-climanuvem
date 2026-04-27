import React from 'react';
import { View, Text, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getProfileViewStyles } from '@/src/styles/globalStyles';
import { AppHeader } from '@/components/ui/AppHeader';
import { AuthButton } from '@/components/ui/AuthButton';
import { StatusModal, ModalType } from '@/components/ui/StatusModal';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

interface ProfileViewProps {
  controller: {
    userName: string;
    userEmail: string;
    newName: string;
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

export function ProfileView({ controller }: Readonly<ProfileViewProps>) {
  const {
    userName,
    userEmail,
    newName,
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
  const styles = getProfileViewStyles(theme);

  const hasNameChanged = newName.trim() !== userName && newName.trim().length > 0;

  return (
    <View style={styles.container}>
      <AppHeader title="Mi Perfil" showBack={true} onBack={handleGoBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={theme.colors.primary} />
          </View>
          <ThemedText style={styles.emailText}>{userEmail}</ThemedText>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Escribe tu nombre"
            placeholderTextColor="#999"
          />
          <View style={styles.saveAction}>
            <AuthButton
              title={saving ? "Guardando..." : "Guardar Cambios"}
              onPress={handleUpdateName}
              variant="primary"
              disabled={!hasNameChanged || saving}
              textStyle={{ fontSize: 14 }}
              style={{ paddingVertical: 12, paddingHorizontal: 20 }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          <Text style={styles.warningText}>
            Personaliza el tema de la aplicación.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
              style={[
                styles.themeButton, 
                themeMode === 'light' && styles.themeButtonActive
              ]} 
              onPress={() => setThemeMode('light')}
            >
              <Ionicons name="sunny-outline" size={18} color={themeMode === 'light' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.themeButtonText, themeMode === 'light' && { color: theme.colors.primary }]}>Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.themeButton, 
                themeMode === 'dark' && styles.themeButtonActive
              ]} 
              onPress={() => setThemeMode('dark')}
            >
              <Ionicons name="moon-outline" size={18} color={themeMode === 'dark' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.themeButtonText, themeMode === 'dark' && { color: theme.colors.primary }]}>Oscuro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.themeButton, 
                themeMode === 'system' && styles.themeButtonActive
              ]} 
              onPress={() => setThemeMode('system')}
            >
              <Ionicons name="phone-portrait-outline" size={18} color={themeMode === 'system' ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.themeButtonText, themeMode === 'system' && { color: theme.colors.primary }]}>Sistema</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, styles.dangerCard]}>
          <Text style={[styles.sectionTitle, styles.dangerText]}>Zona de peligro</Text>
          <Text style={styles.warningText}>
            Una vez elimines tu cuenta, no hay vuelta atrás. Por favor asegura tu decisión.
          </Text>
          <TouchableOpacity 
            style={styles.dangerButton} 
            onPress={confirmDeleteAccount}
            disabled={deleting}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.dangerButtonText}>Eliminar Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de confirmación de borrado */}
      <Modal visible={showDeleteConfirm} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={40} color={theme.colors.danger} />
            </View>
            <Text style={styles.modalTitle}>¿Eliminar cuenta?</Text>
            <Text style={styles.modalBody}>
              Esta acción es permanente y eliminará todos tus análisis. ¿Estás seguro de continuar?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelDeleteAccount}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteButton} onPress={proceedWithDelete}>
                <Text style={styles.confirmDeleteButtonText}>Sí, eliminar</Text>
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


