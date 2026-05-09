import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from '../i18n';

export type LanguageMode = 'en' | 'es' | 'system';

interface LanguageContextType {
  languageMode: LanguageMode;
  setLanguageMode: (mode: LanguageMode) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  languageMode: 'system',
  setLanguageMode: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languageModeState, setLanguageModeState] = useState<LanguageMode>('system');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'system') {
          setLanguageModeState(savedLanguage);
          applyLanguage(savedLanguage);
        } else {
          applyLanguage('system');
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadLanguage();
  }, []);

  const applyLanguage = (mode: LanguageMode) => {
    let lngToSet = mode;
    if (mode === 'system') {
      const locales = Localization.getLocales();
      if (locales && locales.length > 0) {
        const sysLng = locales[0].languageCode;
        lngToSet = (sysLng === 'es' || sysLng === 'en') ? sysLng : 'en';
      } else {
        lngToSet = 'en';
      }
    }
    i18n.changeLanguage(lngToSet);
  };

  const setLanguageMode = useCallback(async (mode: LanguageMode) => {
    setLanguageModeState(mode);
    applyLanguage(mode);
    try {
      await AsyncStorage.setItem('appLanguage', mode);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const contextValue = useMemo(() => ({
    languageMode: languageModeState,
    setLanguageMode
  }), [languageModeState, setLanguageMode]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
