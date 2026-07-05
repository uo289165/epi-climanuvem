import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from '@/src/services/LoggerService';

export const usePersistedPreference = <T extends string>(
  key: string,
  defaultValue: T,
  isValid: (value: string) => value is T,
) => {
  const [value, setValueState] = useState<T>(defaultValue);

  useEffect(() => {
    const loadPreference = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(key);
        if (savedValue && isValid(savedValue)) {
          setValueState(savedValue);
        }
      } catch (error) {
        Logger.error(`Error loading persisted preference ${key}`, error);
      }
    };
    loadPreference();
  }, [isValid, key]);

  const setValue = useCallback(async (nextValue: T) => {
    setValueState(nextValue);
    try {
      await AsyncStorage.setItem(key, nextValue);
    } catch (error) {
      Logger.error(`Error saving persisted preference ${key}`, error);
    }
  }, [key]);

  return [value, setValue] as const;
};
