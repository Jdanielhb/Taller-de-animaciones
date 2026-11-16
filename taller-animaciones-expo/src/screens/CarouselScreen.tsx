import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACER = (width - ITEM_WIDTH) / 2;

type Item = { id: string; title: string; emoji: string; color: string };

const DATA: Item[] = [
  { id: '1', title: 'Montañas', emoji: '🏔️', color: '#6C5CE7' },
  { id: '2', title: 'Playa', emoji: '🏖️', color: '#0984e3' },
  { id: '3', title: 'Bosque', emoji: '🌲', color: '#00b894' },
  { id: '4', title: 'Desierto', emoji: '🏜️', color: '#fdcb6e' },
  { id: '5', title: 'Ciudad', emoji: '🌆', color: '#e17055' },
  { id: '6', title: 'Espacio', emoji: '🚀', color: '#2d3436' },
];

type CardProps = { item: Item; index: number; scrollX: SharedValue<number> };

function Card({ item, index, scrollX }: CardProps) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH];
    const scale = interpolate(scrollX.value, input, [0.8, 1, 0.8], Extrapolation.CLAMP);
    const rotate = interpolate(scrollX.value, input, [12, 0, -12], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, input, [30, 0, 30], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, input, [0.5, 1, 0.5], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }, { rotateZ: `${rotate}deg` }],
    };
  });

  return (
    <View style={{ width: ITEM_WIDTH }}>
      <Animated.View style={[styles.card, { backgroundColor: item.color }, style]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </Animated.View>
    </View>
  );
}

export default function CarouselScreen() {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={DATA}
        keyExtractor={(i: Item) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SPACER, alignItems: 'center' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }: { item: Item; index: number }) => <Card item={item} index={index} scrollX={scrollX} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#f5f6fa' },
  card: {
    marginHorizontal: 10,
    height: 340,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  emoji: { fontSize: 80 },
  title: { marginTop: 16, fontSize: 26, fontWeight: '700', color: '#fff' },
});
