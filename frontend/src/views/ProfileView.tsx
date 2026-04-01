import React from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
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

  const hasNameChanged = newName.trim() !== userName && newName.trim().length > 0;

  return (
    <View style={styles.container}>
      <AppHeader title="Mi Perfil" showBack={true} onBack={handleGoBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color="#007AFF" />
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
              <Ionicons name="warning" size={40} color="#F44336" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  saveAction: {
    alignItems: 'flex-end',
  },
  dangerCard: {
    borderColor: '#FFCDD2',
    borderWidth: 1,
  },
  dangerText: {
    color: '#D32F2F',
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalBody: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 15,
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: '#F44336',
    alignItems: 'center',
  },
  confirmDeleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
