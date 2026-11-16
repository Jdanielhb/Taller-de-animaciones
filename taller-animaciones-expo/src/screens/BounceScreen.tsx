import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

export default function BounceScreen() {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Mantén presionado y suelta</Text>
      <Pressable
        onPressIn={() => {
          // Al presionar reduce su tamaño
          scale.value = withTiming(0.6, { duration: 120 });
        }}
        onPressOut={() => {
          // Al soltar vuelve al tamaño original con rebote (spring poco amortiguado)
          scale.value = withSpring(1, { damping: 3, stiffness: 180, mass: 0.8 });
        }}
      >
        <Animated.View style={[styles.circle, style]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' },
  hint: { position: 'absolute', top: 20, color: '#555' },
  circle: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#e17055' },
});
