import { useEffect, useRef, useState, useCallback } from "react";

const CHORDS = [
  [196.0, 246.94, 293.66], // G major
  [174.61, 220.0, 261.63], // F major
  [164.81, 207.65, 246.94], // E minor
  [220.0, 261.63, 329.63], // A minor
];

export function useAmbientMusic() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const activeNodes = useRef<AudioScheduledSourceNode[]>([]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeNodes.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // ignore
      }
    });
    activeNodes.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);

    let chordIndex = 0;

    const playChord = () => {
      const now = ctx.currentTime;
      const chord = CHORDS[chordIndex];
      chordIndex = (chordIndex + 1) % CHORDS.length;

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        // Gentle stereo-ish panning
        const pan = ctx.createStereoPanner?.();
        if (pan) {
          pan.pan.value = (i - 1) * 0.2;
          osc.connect(gain);
          gain.connect(pan);
          pan.connect(master);
        } else {
          osc.connect(gain);
          gain.connect(master);
        }
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 4.5);
        osc.start(now);
        osc.stop(now + 4.8);
        activeNodes.current.push(osc);
      });
    };

    playChord();
    intervalRef.current = window.setInterval(playChord, 4800);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stop();
    } else {
      start();
    }
  }, [playing, start, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { playing, toggle };
}
