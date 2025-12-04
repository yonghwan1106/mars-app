'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type AlertSeverity = 'info' | 'warning' | 'critical';

interface UseAlertSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export function useAlertSound(options: UseAlertSoundOptions = {}) {
  const { enabled = true, volume = 0.5 } = options;
  const [isMuted, setIsMuted] = useState(!enabled);
  const [isSupported, setIsSupported] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Check if Web Audio API is supported
    setIsSupported(typeof window !== 'undefined' && 'AudioContext' in window);
  }, []);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && isSupported) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, [isSupported]);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (isMuted || !isSupported) return;

    const audioContext = initAudioContext();
    if (!audioContext) return;

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Fade in/out to avoid clicks
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }, [isMuted, isSupported, volume, initAudioContext]);

  const playAlertSound = useCallback((severity: AlertSeverity) => {
    if (isMuted || !isSupported) return;

    switch (severity) {
      case 'critical':
        // Urgent alarm - high frequency beeps
        playTone(880, 0.15, 'square');
        setTimeout(() => playTone(880, 0.15, 'square'), 200);
        setTimeout(() => playTone(880, 0.15, 'square'), 400);
        setTimeout(() => playTone(1100, 0.3, 'square'), 600);
        break;

      case 'warning':
        // Warning - two-tone alert
        playTone(660, 0.2, 'triangle');
        setTimeout(() => playTone(550, 0.2, 'triangle'), 250);
        break;

      case 'info':
        // Info - gentle notification
        playTone(523, 0.15, 'sine');
        setTimeout(() => playTone(659, 0.15, 'sine'), 150);
        break;

      default:
        playTone(440, 0.2, 'sine');
    }
  }, [isMuted, isSupported, playTone]);

  const playSuccessSound = useCallback(() => {
    if (isMuted || !isSupported) return;
    playTone(523, 0.1, 'sine');
    setTimeout(() => playTone(659, 0.1, 'sine'), 100);
    setTimeout(() => playTone(784, 0.15, 'sine'), 200);
  }, [isMuted, isSupported, playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playAlertSound,
    playSuccessSound,
    playTone,
    isMuted,
    toggleMute,
    isSupported,
  };
}
