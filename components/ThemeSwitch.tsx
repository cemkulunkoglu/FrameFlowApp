import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from './ThemedText';

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggle: (value: boolean) => void;
}

export function ThemeSwitch({ isDarkMode, onToggle }: ThemeSwitchProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(!isDarkMode)}
      style={styles.switchContainer}
    >
      <View style={[
        styles.switch,
        { backgroundColor: isDarkMode ? '#1c1c1e' : '#e0e0e0' }
      ]}>
        <View style={[
          styles.switchThumb,
          { transform: [{ translateX: isDarkMode ? 22 : 0 }] }
        ]}>
          <ThemedText style={styles.icon}>
            {isDarkMode ? '🌙' : '☀️'}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    padding: 5,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 12,
  },
}); 