// src/hooks/useAudio.js
import { useCallback } from "react";

export default function useAudio() {
  const playSound = useCallback((type) => {
    try {
      // Expects files like /roll.mp3 to exist in the /public folder
      const audio = new Audio(`/${type}.mp3`);
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.warn("Audio play blocked by browser policy until interaction.", err);
      });
    } catch (e) {
      console.error("Audio error", e);
    }
  }, []);

  return { playSound };
}