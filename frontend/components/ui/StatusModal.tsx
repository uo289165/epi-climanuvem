import React from 'react';
import { Modal, View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type ModalType = 'loading' | 'success' | 'error' | 'info';

interface StatusModalProps {
  readonly visible: boolean;
  readonly type: ModalType;
  readonly title?: string;
  readonly message?: string;
  readonly onClose?: () => void;
}

export function StatusModal({ visible, type, title, message, onClose }: StatusModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={60} color="#34C759" />;
      case 'error':
        return <Ionicons name="alert-circle" size={60} color="#FF3B30" />;
      case 'info':
        return <Ionicons name="information-circle" size={60} color="#007AFF" />;
      default:
        return null;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {type === 'loading' ? (
            <>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>{title || 'Cargando...'}</Text>
              {message && <Text style={styles.subtext}>{message}</Text>}
            </>
          ) : (
            <>
              <View style={styles.iconContainer}>
                {getIcon()}
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
  },
  subtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
