import { router } from 'expo-router';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';

export const useWelcome = () => {
  const historyHook = useAnalysisHistory();

  const handleNavigateToLogin = () => {
    router.push('/login' as any);
  };

  const handleNavigateToCapture = () => {
    router.push('/capture' as any);
  };

  return {
    handleNavigateToLogin,
    handleNavigateToCapture,
    ...historyHook,
  };
};
