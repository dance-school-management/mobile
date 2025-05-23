import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome);

export default function Page() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animateTrophySize = () => {
    scale.value = withTiming(scale.value === 1 ? 1.5 : 1, {
      duration: 500,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable onPress={animateTrophySize}>
        <AnimatedIcon
          name="trophy"
          size={40}
          color="gold"
          style={animatedStyle}
        />
      </Pressable>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        Liczba odbytych zajęć:
      </Text>
    </View>
  );
}
