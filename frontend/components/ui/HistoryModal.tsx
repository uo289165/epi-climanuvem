import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisHistoryItem } from '@/src/services/AnalysisService';
import { AnalysisDetail } from './AnalysisDetail';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  history: AnalysisHistoryItem[];
  loading: boolean;
  onRefresh?: () => void;
  initialSelectedAnalysisId?: string | null;
}

const HandleBar = () => (
  <View style={styles.handleContainer}>
    <View style={styles.handle} />
  </View>
);

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

const RenderHistoryItem = ({ item, onSelect }: { item: AnalysisHistoryItem, onSelect: (item: AnalysisHistoryItem) => void }) => (
  <TouchableOpacity 
    style={styles.historyItem} 
    onPress={() => onSelect(item)}
  >
    <View style={styles.itemHeader}>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <Text style={styles.dateText}>{formatDate(item.date)}</Text>
    </View>
    <View style={styles.itemFooter}>
      {item.location && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color="#CCC" />
    </View>
  </TouchableOpacity>
);

const Separator = () => <View style={styles.separator} />;

interface HistoryContentProps {
  loading: boolean;
  history: AnalysisHistoryItem[];
  selectedAnalysis: AnalysisHistoryItem | null;
  setSelectedAnalysis: (item: AnalysisHistoryItem | null) => void;
}

const HistoryContent = ({ 
  loading, 
  history, 
  selectedAnalysis, 
  setSelectedAnalysis 
}: HistoryContentProps) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  if (selectedAnalysis) {
    return (
      <AnalysisDetail 
        analysis={selectedAnalysis} 
        onBack={() => setSelectedAnalysis(null)} 
      />
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="list-outline" size={48} color="#CCC" />
        <Text style={styles.emptyText}>No hay análisis realizados todavía.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={history}
      renderItem={({ item }) => <RenderHistoryItem item={item} onSelect={setSelectedAnalysis} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={Separator}
    />
  );
};

export const HistoryModal = ({ visible, onClose, history, loading, onRefresh, initialSelectedAnalysisId }: HistoryModalProps) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistoryItem | null>(null);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (initialSelectedAnalysisId && history.length > 0) {
      const found = history.find(a => a.id === initialSelectedAnalysisId);
      if (found) setSelectedAnalysis(found);
    }
  }, [initialSelectedAnalysisId, history]);

  const handleClose = () => {
    translateY.value = 0;
    setSelectedAnalysis(null);
    onClose();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      'worklet';
      if (event.translationY > 150 || event.velocityY > 500) {
        scheduleOnRN(Haptics.notificationAsync, Haptics.NotificationFeedbackType.Success);
        scheduleOnRN(handleClose);
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, 300],
      [0.5, 0],
      'clamp'
    );
    return {
      backgroundColor: `rgba(0,0,0,${opacity})`,
    };
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.View style={[styles.overlay, backdropStyle]}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <GestureDetector gesture={panGesture}>
              <View style={styles.gestureHeader}>
                <HandleBar />
                {!selectedAnalysis && (
                  <View style={styles.header}>
                    <Text style={styles.title}>Historial de Análisis</Text>
                    <View style={styles.headerActions}>
                      {onRefresh && (
                        <TouchableOpacity onPress={onRefresh} style={styles.actionButton} disabled={loading}>
                          <Ionicons name="refresh" size={24} color={loading ? "#999" : "#333"} />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={onClose} style={styles.actionButton}>
                        <Ionicons name="close" size={24} color="#333" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </GestureDetector>

            <HistoryContent 
              loading={loading}
              history={history}
              selectedAnalysis={selectedAnalysis}
              setSelectedAnalysis={setSelectedAnalysis}
            />
          </Animated.View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  gestureHeader: {
    width: '100%',
    backgroundColor: 'white',
    // We keep this area as the handle for closing the modal
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    padding: 24,
  },
  historyItem: {
    paddingVertical: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 13,
    color: '#888',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
});
