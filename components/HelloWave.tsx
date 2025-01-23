import { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export function HelloWave() {
  const waveAnimation = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              rotate: waveAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '20deg'],
              }),
            },
          ],
        },
      ]}>
      <ThemedText style={styles.text}>👋</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
