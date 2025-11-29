import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { X } from 'lucide-react-native';

interface BreathingModalProps {
  visible: boolean;
  onClose: () => void;
}

const PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold'] as const;
const PHASE_DURATION = 4000; // 4 seconds per phase

export default function BreathingModal({ visible, onClose }: BreathingModalProps) {
  const [phase, setPhase] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const AnimatedView = Animated.createAnimatedComponent(View);

  useEffect(() => {
    if (!visible) {
      setIsActive(false);
      setPhase(0);
      scaleAnim.setValue(1);
    }
  }, [visible]);

  useEffect(() => {
    if (!isActive) return;

    const phaseInterval = setInterval(() => {
      setPhase(p => (p + 1) % 4);
    }, PHASE_DURATION);

    const countdownInterval = setInterval(() => {
      setCountdown(c => (c === 1 ? 4 : c - 1));
    }, 1000);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(countdownInterval);
    };
  }, [isActive]);

  useEffect(() => {
  if (!isActive) return;

  const currentPhase = PHASES[phase];

  // Only animate for Inhale and Exhale phases
  if (currentPhase === 'Inhale') {
    Animated.timing(scaleAnim, {
      toValue: 1.5,
      duration: PHASE_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  } else if (currentPhase === 'Exhale') {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: PHASE_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }
  // Hold phases do nothing - the animation naturally stays at its current value
}, [phase, isActive, scaleAnim]);

  const startBreathing = () => {
    setIsActive(true);
    setPhase(0);
    setCountdown(4);
    scaleAnim.setValue(1);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setPhase(0);
    scaleAnim.setValue(1);
  };

  if (!visible) return null;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="text-slate-800 font-bold text-xl">Box Breathing</Text>
        <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
          <X size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {/* Breathing Circle */}
        <View className="items-center justify-center w-64 h-64 mb-8">
          <AnimatedView
            style={{
              transform: [{ scale: scaleAnim }],
            }}
            className={`w-48 h-48 rounded-full items-center justify-center ${
              isActive ? 'bg-indigo-100' : 'bg-slate-100'
            }`}
          >
            <View className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-50" />
            <Text className="text-xl font-medium text-indigo-600">
              {isActive ? PHASES[phase] : 'Ready?'}
            </Text>
          </AnimatedView>
        </View>

        {/* Phase dots */}
        {isActive && (
          <View className="flex-row gap-3 mb-6">
            {PHASES.map((p, i) => (
              <View
                key={i}
                className={`w-3 h-3 rounded-full ${
                  phase === i ? 'bg-indigo-500' : 'bg-indigo-200'
                }`}
              />
            ))}
          </View>
        )}

        {/* Instructions */}
        <Text className="text-slate-500 text-center px-8 mb-8 max-w-xs">
          Box breathing helps regulate stress. Follow the circle's rhythm.
        </Text>

        {/* Control Button */}
        <TouchableOpacity
          onPress={isActive ? stopBreathing : startBreathing}
          className={`px-8 py-4 rounded-full ${
            isActive ? 'bg-rose-100' : 'bg-indigo-600'
          }`}
        >
          <Text className={`font-semibold text-base ${
            isActive ? 'text-rose-600' : 'text-white'
          }`}>
            {isActive ? 'Stop Session' : 'Start Breathing'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}