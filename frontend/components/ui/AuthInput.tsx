import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  showEyeIcon?: boolean;
  onEyePress?: () => void;
  secureTextEntry?: boolean;
}

export const AuthInput = React.forwardRef<TextInput, AuthInputProps>(
  ({ icon, showEyeIcon, onEyePress, secureTextEntry, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        {icon && <Ionicons name={icon} size={20} color="#888" style={styles.icon} />}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor="#888"
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {showEyeIcon && (
          <TouchableOpacity onPress={onEyePress} style={styles.eyeIcon}>
            <Ionicons name={secureTextEntry ? 'eye' : 'eye-off'} size={24} color="#888" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

AuthInput.displayName = 'AuthInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
});
