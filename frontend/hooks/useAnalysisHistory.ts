import { useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';
import { AnalysisService, AnalysisHistoryItem } from '@/src/services/AnalysisService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';
import * as Notifications from 'expo-notifications';
import { Logger } from '@/src/services/LoggerService';

export const useAnalysisHistory = () => {
  const notificationsEnabled = Platform.OS !== 'web' && process.env.EXPO_PUBLIC_TEST_MODE !== 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [initialSelectedAnalysisId, setInitialSelectedAnalysisId] = useState<string | null>(null);
  
  // Track to avoid processing the same notification repeatedly
  const [processedNotificationId, setProcessedNotificationId] = useState<string | null>(null);
  const lastNotificationResponse = notificationsEnabled
    ? Notifications.useLastNotificationResponse()
    : null;

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEST_MODE === 'true') {
      setIsLoggedIn(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        setHistory([]);
        setHasLoaded(false);
      }
    });
    return unsubscribe;
  }, []);

  const loadHistory = useCallback(async (forceRefresh: boolean = false, openModal: boolean = true) => {
    if (openModal) {
      setHistoryModalVisible(true);
    }
    
    if (hasLoaded && !forceRefresh) {
      return;
    }

    setLoadingHistory(true);
    try {
      const data = await AnalysisService.getHistory(isLoggedIn);
      setHistory(data);
      setHasLoaded(true);
    } catch (error) {
      Logger.error('Error loading history', error);
    } finally {
      setLoadingHistory(false);
    }
  }, [hasLoaded, isLoggedIn]);

  // Manage background/cold start taps through Expo's hook
  useEffect(() => {
    if (lastNotificationResponse && isLoggedIn) {
      const reqId = lastNotificationResponse.notification.request.identifier;
      if (reqId !== processedNotificationId) {
        setProcessedNotificationId(reqId);
        const data = lastNotificationResponse.notification.request.content.data;
        if (data?.analysis_id) {
          setInitialSelectedAnalysisId(data.analysis_id as string);
          loadHistory(true);
        }
      }
    }
  }, [lastNotificationResponse, isLoggedIn, loadHistory, processedNotificationId]);

  // Manage foreground notifications automatically
  useEffect(() => {
    if (!notificationsEnabled) {
      return;
    }

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      if (isLoggedIn) {
        loadHistory(true, false); // Reload history but do NOT auto-open modal!
      }
    });

    return () => {
      notificationListener.remove();
    };
  }, [isLoggedIn, loadHistory, notificationsEnabled]);

  // Manage manual refresh events
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('refresh_history', () => {
      if (isLoggedIn) {
        loadHistory(true, false); // Reload history but do NOT auto-open modal
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isLoggedIn, loadHistory]);

  const closeHistoryModal = () => {
    setHistoryModalVisible(false);
    setInitialSelectedAnalysisId(null);
  };

  return {
    historyModalVisible,
    history,
    loadingHistory,
    loadHistory,
    closeHistoryModal,
    initialSelectedAnalysisId,
  };
};
