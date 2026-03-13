import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'google' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const AuthButton = ({ 
  title, 
  onPress, 
  loading, 
  variant = 'primary', 
  icon, 
  style, 
  textStyle,
  disabled 
}: AuthButtonProps) => {
  const isGoogle = variant === 'google';
  const isOutline = variant === 'outline';

  const getIconColor = () => {
    if (isGoogle) return '#db4437';
    if (isOutline) return '#007AFF';
    return 'white';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        styles[variant], 
        (loading || disabled) && styles.disabled, 
        style
      ]} 
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={isGoogle || isOutline ? '#007AFF' : 'white'} />
      ) : (
        <>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={getIconColor()} 
              style={styles.icon} 
            />
          )}
          <Text style={[
            styles.text, 
            isGoogle && styles.googleText, 
            isOutline && styles.outlineText,
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#34C759',
  },
  google: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  googleText: {
    color: '#333',
  },
  outlineText: {
    color: '#007AFF',
  },
  icon: {
    marginRight: 10,
  },
});
