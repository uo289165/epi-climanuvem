import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
  LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisHistoryItem, AnalysisService } from '@/src/services/AnalysisService';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getAnalysisDetailStyles } from '@/src/styles/globalStyles';
import { getStatusColor, getStatusText } from '@/src/utils/statusUtils';

interface AnalysisDetailProps {
  analysis: AnalysisHistoryItem;
  onBack: () => void;
  onDeleteSuccess?: () => void;
}

const getWarningLevelColor = (level: number, theme: any) => {
  switch (level) {
    case 0: return '#546E7A'; // Info
    case 1: return theme.colors.warning; // Aviso
    case 2: return theme.colors.danger; // Peligro
    case 3: return '#B71C1C'; // Crítico
    default: return theme.colors.danger;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AnalysisResults = ({ analysis, styles, theme, onCancel }: { analysis: AnalysisHistoryItem, styles: any, theme: any, onCancel: () => void }) => {
  if (analysis.status === 'analyzing') {
    return (
      <View style={styles.processingContainer}>
        <View style={styles.processingRow}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.processingText}>El análisis sigue en progreso...</Text>
        </View>
        <TouchableOpacity style={styles.cancelAnalysisBtn} onPress={onCancel}>
          <Text style={styles.cancelAnalysisBtnText}>Cancelar Análisis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (analysis.status === 'cancelled') {
      return <Text style={styles.noResultsText}>Este análisis fue cancelado.</Text>;
  }

  if (analysis.status === 'completed') {
    return (
      <View>
        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Nubes Identificadas:</Text>
          <View style={styles.tagContainer}>
            {analysis.results?.cloudTypes.map((type) => (
              <View key={`${analysis.id}-cloud-${type}`} style={styles.tag}>
                <Text style={styles.tagText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.resultItem}>
          <Text style={styles.resultLabel}>Pronóstico Estimado:</Text>
          <Text style={styles.resultValue}>{analysis.results?.forecast}</Text>
        </View>

        {analysis.results?.warnings && analysis.results.warnings.length > 0 && (
          <View style={styles.resultItem}>
            <Text style={[styles.resultLabel, { color: theme.colors.danger }]}>Advertencias:</Text>
            {analysis.results.warnings.map((warning, index) => {
              const text = typeof warning === 'string' ? warning : warning.text;
              const level = typeof warning === 'string' ? 0 : warning.level;
              const color = getWarningLevelColor(level, theme);

              return (
                <View key={`${analysis.id}-warning-${index}`} style={styles.warningRow}>
                  <Ionicons name="warning" size={16} color={color} />
                  <Text style={[styles.warningText, { color }]}>{text}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  return <Text style={styles.noResultsText}>No hay resultados disponibles.</Text>;
};

export const AnalysisDetail = ({ analysis, onBack, onDeleteSuccess }: AnalysisDetailProps) => {
  const { theme } = useTheme();
  const styles = getAnalysisDetailStyles(theme);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [imageLayout, setImageLayout] = useState<{ width: number; height: number } | null>(null);
  const [intrinsicImageSize, setIntrinsicImageSize] = useState<{ width: number; height: number } | null>(null);

  const executeDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    try {
      await AnalysisService.deleteAnalysis(analysis.id);
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error al eliminar el análisis:", error);
      Alert.alert("Error", "No se pudo eliminar el análisis.");
      setIsDeleting(false);
    }
  };

  const executeCancel = async () => {
    setShowCancelModal(false);
    setIsDeleting(true); // Re-use loading state to block actions
    try {
      await AnalysisService.cancelAnalysis(analysis.id);
      onDeleteSuccess?.(); // Go back and refresh since state changed
    } catch (error) {
      console.error("Error al cancelar el análisis:", error);
      Alert.alert("Error", "No se pudo cancelar el análisis.");
      setIsDeleting(false);
    }
  };

  const handleDeletePress = () => {
    setShowConfirmModal(true);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setImageLayout({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isDeleting}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Detalles</Text>
        <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton} disabled={isDeleting}>
          {isDeleting ? (
             <ActivityIndicator size="small" color={theme.colors.danger} />
          ) : (
             <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.detailContent}>
        <View style={styles.imageContainer} onLayout={handleLayout}>
          {analysis.imageUrl ? (
            <Image 
              source={{ uri: analysis.imageUrl }} 
              style={styles.analysisImage}
              resizeMode="contain"
              onLoad={(e) => setIntrinsicImageSize({
                width: e.nativeEvent.source.width,
                height: e.nativeEvent.source.height
              })}
            />
          ) : (
            <View style={[styles.analysisImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={48} color={theme.colors.border} />
            </View>
          )}
          
          {/* Render Bounding Boxes */}
          {imageLayout && intrinsicImageSize && analysis.results?.cloudDetails?.map((detail, index) => {
            if (!detail.box) return null;
            const [val1, val2, val3, val4] = detail.box;
            
            // Extract coordinates safely, handling potential inverted arrays
            const ymin = Math.min(val1, val3);
            const ymax = Math.max(val1, val3);
            const xmin = Math.min(val2, val4);
            const xmax = Math.max(val2, val4);
            
            const scale = Math.min(
              imageLayout.width / intrinsicImageSize.width,
              imageLayout.height / intrinsicImageSize.height
            );
            
            const renderedWidth = intrinsicImageSize.width * scale;
            const renderedHeight = intrinsicImageSize.height * scale;
            
            const offsetX = (imageLayout.width - renderedWidth) / 2;
            const offsetY = (imageLayout.height - renderedHeight) / 2;
            
            const top = offsetY + ymin * renderedHeight;
            const left = offsetX + xmin * renderedWidth;
            const width = (xmax - xmin) * renderedWidth;
            const height = (ymax - ymin) * renderedHeight;

            return (
              <View 
                key={`box-${detail.type}-${index}`} 
                style={{
                  position: 'absolute',
                  top,
                  left,
                  width,
                  height,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  backgroundColor: 'rgba(33, 150, 243, 0.2)', // translucent primary
                }}
              >
                <View style={{
                  position: 'absolute',
                  top: -20,
                  left: -2,
                  backgroundColor: theme.colors.primary,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {detail.type}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={[styles.detailStatusBadge, { backgroundColor: getStatusColor(analysis.status, theme) }]}>
            <Text style={styles.detailStatusText}>{getStatusText(analysis.status)}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>{formatDate(analysis.date)}</Text>
          </View>
          {analysis.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>{analysis.location}</Text>
            </View>
          )}
          {analysis.latitude != null && analysis.longitude != null && (
            <View style={styles.infoRow}>
              <Ionicons name="compass-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>Lat: {analysis.latitude.toFixed(4)}, Lng: {analysis.longitude.toFixed(4)}</Text>
            </View>
          )}
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Resultados del Análisis</Text>
          <AnalysisResults 
            analysis={analysis} 
            styles={styles} 
            theme={theme}
            onCancel={() => setShowCancelModal(true)}
          />
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={showConfirmModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Eliminar análisis</Text>
            <Text style={styles.confirmText}>¿Estás seguro de que deseas eliminar este análisis del historial?</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={executeDelete}>
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Analysis Confirmation Modal */}
      <Modal visible={showCancelModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>Cancelar análisis</Text>
            <Text style={styles.confirmText}>¿Deseas cancelar este análisis? Será retirado de la cola de procesamiento.</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.cancelBtnText}>Volver</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={executeCancel}>
                <Text style={styles.deleteBtnText}>Sí, Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
