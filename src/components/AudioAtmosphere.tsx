import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioAtmosphere: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startGothicAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Romantic Gothic chord progressions (frequencies in Hz: D minor, A minor, F major, Bb major)
      // D3, F3, A3, D4, E4, F4, G4, A4
      const notes = [146.83, 174.61, 220.0, 293.66, 329.63, 349.23, 392.0, 440.0, 523.25];

      // Soft pad drone
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(73.42, ctx.currentTime); // D2 low drone
      droneGain.gain.setValueAtTime(0.04, ctx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start();

      // Periodic ethereal harp-like notes
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const now = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        // Random note from scale
        const note = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now);

        // Slow attack and long gentle release
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 3.6);
      };

      // Play initial chimes
      playChime();
      setTimeout(playChime, 600);
      setTimeout(playChime, 1400);

      // Random gentle intervals
      intervalRef.current = window.setInterval(() => {
        playChime();
        if (Math.random() > 0.4) {
          setTimeout(playChime, 400 + Math.random() * 800);
        }
      }, 2400);

      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio not allowed or supported', e);
    }
  };

  const stopAmbient = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startGothicAmbient();
    }
  };

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      title={isPlaying ? 'Pausar ambiência gótica' : 'Ouvir ambiência gótica mística'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all border border-[#c5a059]/40 bg-[#140d12]/80 hover:bg-[#20121a] hover:border-[#c5a059] text-[#e8d08d]"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#e8d08d] animate-pulse" />
          <span className="hidden sm:inline">Música Atmosférica</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#a6988f]" />
          <span className="hidden sm:inline text-[#a6988f]">Ambiência Sonora</span>
        </>
      )}
    </button>
  );
};
