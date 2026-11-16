import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function LoadingScreen() {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  // Al montar el componente arrancan ambas animaciones en bucle infinito
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
    progress.value = withRepeat(
      withTiming(100, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, spinnerStyle]} />
      <Text style={styles.text}>Cargando...</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa', padding: 30 },
  spinner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 7,
    borderColor: '#dcdde1',
    borderTopColor: '#6C5CE7',
  },
  text: { marginVertical: 24, fontSize: 18, color: '#333' },
  track: { width: '100%', height: 14, borderRadius: 7, backgroundColor: '#dcdde1', overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: '#00b894', borderRadius: 7 },
});
