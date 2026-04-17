import { useState, useEffect } from 'react';
import { AnalysisService, AnalysisHistoryItem } from '@/src/services/AnalysisService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebaseConfig';

export const useAnalysisHistory = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        setHistory([]);
        setHasLoaded(false);
      }
    });
    return unsubscribe;
  }, []);

  const loadHistory = async (forceRefresh: boolean = false) => {
    setHistoryModalVisible(true);
    
    if (hasLoaded && !forceRefresh) {
      return;
    }

    setLoadingHistory(true);
    try {
      const data = await AnalysisService.getHistory(isLoggedIn);
      setHistory(data);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const closeHistoryModal = () => {
    setHistoryModalVisible(false);
  };

  return {
    historyModalVisible,
    history,
    loadingHistory,
    loadHistory,
    closeHistoryModal,
  };
};
