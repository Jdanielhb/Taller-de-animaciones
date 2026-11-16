import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withSpring,
} from 'react-native-reanimated';

export default function DragRotateScreen() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      x.value = startX.value + e.translationX;
      y.value = startY.value + e.translationY;
      // Izquierda -> rota a la izquierda (negativo), derecha -> rota a la derecha (positivo)
      rotation.value = interpolate(e.translationX, [-150, 0, 150], [-45, 0, 45], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      rotation.value = withSpring(0);
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Arrastra el cuadrado a izquierda o derecha</Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, style]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f6fa' },
  hint: { position: 'absolute', top: 20, color: '#555' },
  box: { width: 110, height: 110, borderRadius: 16, backgroundColor: '#6C5CE7' },
});
