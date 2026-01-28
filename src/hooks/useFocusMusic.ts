import { useState, useRef, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const FOCUS_TRACKS = [
  `${import.meta.env.BASE_URL}audio/slow_piano.mp3`,
  `${import.meta.env.BASE_URL}audio/lofi_chill.mp3`,
  `${import.meta.env.BASE_URL}audio/full_track.mp3`,
  `${import.meta.env.BASE_URL}audio/focus_beat.mp3`,
  `${import.meta.env.BASE_URL}audio/calming_piano.mp3`,
];

export function useFocusMusic() {
  const [isMusicEnabled, setIsMusicEnabled] = useLocalStorage('focus-music-enabled', true);
  const [volume, setVolume] = useLocalStorage('focus-music-volume', 0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.loop = false;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = useCallback((index: number) => {
    if (!audioRef.current || !isMusicEnabled) return;

    const trackIndex = index % FOCUS_TRACKS.length;
    audioRef.current.src = FOCUS_TRACKS[trackIndex];

    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setCurrentTrackIndex(trackIndex);
          setIsPlaying(true);
          setAutoplayBlocked(false);
          setPendingPlay(false);
        })
        .catch((error) => {
          console.warn('Autoplay blocked:', error.message);
          setAutoplayBlocked(true);
          setPendingPlay(true);
          setIsPlaying(false);
        });
    }
  }, [isMusicEnabled]);

  const handleTrackEnd = useCallback(() => {
    // Move to next track, loop back to start if at end
    const nextIndex = (currentTrackIndex + 1) % FOCUS_TRACKS.length;
    playTrack(nextIndex);
  }, [currentTrackIndex, playTrack]);

  // Set up track end listener
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', handleTrackEnd);
    return () => audio.removeEventListener('ended', handleTrackEnd);
  }, [handleTrackEnd]);

  const startMusic = useCallback(() => {
    if (!isMusicEnabled) return;
    
    // Start from a random track for variety
    const randomIndex = Math.floor(Math.random() * FOCUS_TRACKS.length);
    playTrack(randomIndex);
  }, [isMusicEnabled, playTrack]);

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const resumeMusic = useCallback(() => {
    if (!isMusicEnabled) return;
    
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    } else {
      startMusic();
    }
  }, [isMusicEnabled, startMusic]);

  const skipTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % FOCUS_TRACKS.length;
    playTrack(nextIndex);
  }, [currentTrackIndex, playTrack]);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => {
      const newValue = !prev;
      if (!newValue && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPendingPlay(false);
      }
      return newValue;
    });
  }, [setIsMusicEnabled]);

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, [setVolume]);

  // Manual play triggered by user interaction (works for autoplay blocked or any case)
  const retryPlay = useCallback(() => {
    if (audioRef.current && isMusicEnabled) {
      // Reset blocked state since this is a user-triggered action
      setAutoplayBlocked(false);
      setPendingPlay(false);
      const randomIndex = Math.floor(Math.random() * FOCUS_TRACKS.length);
      playTrack(randomIndex);
    }
  }, [isMusicEnabled, playTrack]);

  return {
    isPlaying,
    isMusicEnabled,
    volume,
    currentTrackIndex,
    trackCount: FOCUS_TRACKS.length,
    autoplayBlocked,
    pendingPlay,
    startMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    skipTrack,
    toggleMusic,
    updateVolume,
    retryPlay,
  };
}
