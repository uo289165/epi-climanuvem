import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/src/contexts/ThemeContext';
import { getModalScreenStyles } from '@/src/styles/globalStyles';

export default function ModalScreen() {
  const { theme } = useTheme();
  const styles = getModalScreenStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}


