/**
 * Waveform Visualizer Component
 * Real-time audio visualization during recording
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface WaveformVisualizerProps {
  isRecording: boolean;
  metering?: number; // Audio level in dB (-160 to 0)
}

const NUM_BARS = 40;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 100;

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  metering = -160,
}) => {
  const animations = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(MIN_HEIGHT))
  ).current;

  useEffect(() => {
    if (!isRecording) {
      // Reset all bars to minimum height
      animations.forEach(anim => {
        Animated.timing(anim, {
          toValue: MIN_HEIGHT,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Convert metering (-160 to 0) to height (MIN_HEIGHT to MAX_HEIGHT)
    const normalized = Math.max(0, (metering + 160) / 160);
    const targetHeight = MIN_HEIGHT + normalized * (MAX_HEIGHT - MIN_HEIGHT);

    // Animate bars with slight delays for wave effect
    animations.forEach((anim, index) => {
      const delay = index * 10;
      // Add randomness for more organic feel
      const randomFactor = 0.7 + Math.random() * 0.6;
      const height = Math.max(MIN_HEIGHT, targetHeight * randomFactor);

      Animated.timing(anim, {
        toValue: height,
        duration: 100,
        delay,
        useNativeDriver: false,
      }).start();
    });
  }, [isRecording, metering]);

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {animations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                height: anim,
                width: BAR_WIDTH,
                marginHorizontal: BAR_GAP / 2,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: MAX_HEIGHT,
  },
  bar: {
    backgroundColor: Colors.primary,
    borderRadius: BAR_WIDTH / 2,
  },
});
