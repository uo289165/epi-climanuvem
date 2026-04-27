import React from 'react';
import { Modal, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getStatusModalStyles } from '@/src/styles/globalStyles';

export type ModalType = 'loading' | 'success' | 'error' | 'info' | 'confirm';

interface StatusModalProps {
  readonly visible: boolean;
  readonly type: ModalType;
  readonly title?: string;
  readonly message?: string;
  readonly onClose?: () => void;
  readonly onCancel?: () => void;
}

export function StatusModal({ visible, type, title, message, onClose, onCancel }: StatusModalProps) {
  const { theme } = useTheme();
  const styles = getStatusModalStyles(theme);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={60} color={theme.colors.success} />;
      case 'error':
        return <Ionicons name="alert-circle" size={60} color={theme.colors.danger} />;
      case 'info':
        return <Ionicons name="information-circle" size={60} color={theme.colors.primary} />;
      case 'confirm':
        return <Ionicons name="help-circle" size={60} color={theme.colors.primary} />;
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
              <ActivityIndicator size="large" color={theme.colors.primary} />
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
              
              {type === 'confirm' ? (
                <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
                  <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border }]} onPress={onCancel || onClose}>
                    <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onClose}>
                    <Text style={styles.buttonText}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.button} onPress={onClose}>
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}


