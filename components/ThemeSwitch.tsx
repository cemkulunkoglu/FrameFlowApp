import { View, StyleSheet, TouchableOpacity, Animated, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { useEffect, useRef } from 'react';

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggle: (value: boolean) => void;
}

interface Styles {
  container: ViewStyle;
  thumb: ViewStyle;
  icon: TextStyle;
}

export function ThemeSwitch({ isDarkMode, onToggle }: ThemeSwitchProps) {
  const translateX = useRef(new Animated.Value(isDarkMode ? 26 : 0)).current;
  
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isDarkMode ? 26 : 0,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onToggle(!isDarkMode)}
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1c1c1e' : '#f5f5f7' }
      ]}
    >
      {!isDarkMode && (
        <ThemedText style={[
          styles.icon,
          { left: 5, right: 'auto' }
        ]}>☀️</ThemedText>
      )}
      {isDarkMode && (
        <ThemedText style={[
          styles.icon,
          { color: '#fff', left: 'auto', right: 5 }
        ]}>🌙</ThemedText>
      )}
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: isDarkMode ? '#0071e3' : '#fff',
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    width: 60,
    height: 34,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  thumb: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    left: 4,
  },
  icon: {
    fontSize: 16,
    zIndex: 1,
    position: 'absolute',
  },
}); 