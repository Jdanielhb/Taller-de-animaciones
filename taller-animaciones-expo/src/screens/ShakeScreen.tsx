import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const SHAKE_THRESHOLD = 1.8; // en "g" (la gravedad en reposo ≈ 1)
const COOLDOWN_MS = 800;

export default function ShakeScreen() {
  const offset = useSharedValue(0);
  const lastShake = useRef<number>(0);
  const [shakes, setShakes] = useState<number>(0);

  const runShake = (): void => {
    offset.value = withSequence(
      withTiming(-18, { duration: 50 }),
      withRepeat(withTiming(18, { duration: 100 }), 7, true),
      withTiming(0, { duration: 50 })
    );
    setShakes((s) => s + 1);
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (magnitude > SHAKE_THRESHOLD && now - lastShake.current > COOLDOWN_MS) {
        lastShake.current = now;
        runShake();
      }
    });
    return () => sub.remove();
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }, { rotate: `${offset.value / 2}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Agita el celular físicamente</Text>
      <Animated.View style={[styles.box, style]} />
      <Text style={styles.counter}>Sacudidas detectadas: {shakes}</Text>
      <Button title="Simular sacudida (para emulador)" onPress={runShake} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' },
  hint: { position: 'absolute', top: 20, color: '#555' },
  box: { width: 120, height: 120, borderRadius: 20, backgroundColor: '#d63031', marginBottom: 30 },
  counter: { marginBottom: 16, fontSize: 16, color: '#333' },
});
