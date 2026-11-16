import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const IMAGE_URI = 'https://picsum.photos/id/237/600/600';

export default function MultitouchScreen() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  // Doble toque para restablecer la imagen
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(1);
      rotation.value = withSpring(0);
      tx.value = withSpring(0);
      ty.value = withSpring(0);
      savedScale.value = 1;
      savedRotation.value = 0;
      savedTx.value = 0;
      savedTy.value = 0;
    });

  const gesture = Gesture.Exclusive(doubleTap, Gesture.Simultaneous(pan, pinch, rotate));

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Pellizca para zoom, usa dos dedos para rotar, arrastra para mover.{'\n'}Doble toque para restablecer.</Text>
      <GestureDetector gesture={gesture}>
        <Animated.Image source={{ uri: IMAGE_URI }} style={[styles.image, style]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e272e', overflow: 'hidden' },
  hint: { position: 'absolute', top: 16, color: '#dcdde1', textAlign: 'center', zIndex: 1 },
  image: { width: 280, height: 280, borderRadius: 12 },
});
