import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisHistoryItem } from '@/src/services/AnalysisService';

interface AnalysisDetailProps {
  analysis: AnalysisHistoryItem;
  onBack: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'analyzing':
      return '#2196F3';
    case 'cancelled':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completado';
    case 'analyzing':
      return 'En progreso';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
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

const AnalysisResults = ({ analysis, styles }: { analysis: AnalysisHistoryItem, styles: any }) => {
  if (analysis.status === 'analyzing') {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="small" color="#2196F3" />
        <Text style={styles.processingText}>El análisis sigue en progreso...</Text>
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
            <Text style={[styles.resultLabel, { color: '#F44336' }]}>Advertencias:</Text>
            {analysis.results.warnings.map((warning) => (
              <View key={`${analysis.id}-warning-${warning}`} style={styles.warningRow}>
                <Ionicons name="warning" size={16} color="#F44336" />
                <Text style={styles.warningText}>{warning}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  return <Text style={styles.noResultsText}>No hay resultados disponibles.</Text>;
};

export const AnalysisDetail = ({ analysis, onBack }: AnalysisDetailProps) => {
  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.detailTitle}>Detalles</Text>
      </View>

      <ScrollView contentContainerStyle={styles.detailContent}>
        <View style={styles.imageContainer}>
          {analysis.imageUrl ? (
            <Image 
              source={{ uri: analysis.imageUrl }} 
              style={styles.analysisImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.analysisImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={48} color="#CCC" />
            </View>
          )}
          <View style={[styles.detailStatusBadge, { backgroundColor: getStatusColor(analysis.status) }]}>
            <Text style={styles.detailStatusText}>{getStatusText(analysis.status)}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información General</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{formatDate(analysis.date)}</Text>
          </View>
          {analysis.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.infoText}>{analysis.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Resultados del Análisis</Text>
          <AnalysisResults analysis={analysis} styles={styles} />
        </View>
        
        <Text style={styles.todoText}>[TODO: Implementación final de resultados]</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 64,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  detailContent: {
    padding: 24,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  analysisImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailStatusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  detailStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 32,
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#444',
  },
  resultsSection: {
    marginBottom: 24,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  processingText: {
    marginLeft: 12,
    color: '#1976D2',
    fontSize: 15,
  },
  resultItem: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#D32F2F',
    fontWeight: '500',
  },
  noResultsText: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
  },
  todoText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
    marginTop: 8,
  },
});
