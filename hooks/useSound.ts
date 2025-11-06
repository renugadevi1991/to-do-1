// hooks/useSound.ts
import { useRef, useCallback, useEffect } from 'react';

export const useSound = () => {
  const deleteAudioRef = useRef<HTMLAudioElement | null>(null);
  const successAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements for only two sounds
    deleteAudioRef.current = new Audio('/sounds/delete.mp3');
    successAudioRef.current = new Audio('/sounds/done.mp3');

    // Set volume
    deleteAudioRef.current.volume = 0.5;
    successAudioRef.current.volume = 0.5;

    // Preload
    deleteAudioRef.current.preload = 'auto';
    successAudioRef.current.preload = 'auto';
  }, []);

  const playDeleteSound = useCallback(() => {
    if (deleteAudioRef.current) {
      deleteAudioRef.current.currentTime = 0;
      deleteAudioRef.current.play().catch(() => {});
    }
  }, []);

  const playSuccessSound = useCallback(() => {
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0;
      successAudioRef.current.play().catch(() => {});
    }
  }, []);

  // playAddSound does nothing now
  const playAddSound = useCallback(() => {
    // No sound for adding todos
  }, []);

  return {
    playDeleteSound,
    playAddSound, // Keep this for compatibility but it does nothing
    playSuccessSound,
  };
};