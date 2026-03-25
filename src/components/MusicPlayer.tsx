import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "SYNTH_WAVE_01",
    artist: "NEURAL_CORE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "CYBER_PUNK_X",
    artist: "VOID_RUNNER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-magenta)"
  },
  {
    id: 3,
    title: "GLITCH_DREAM",
    artist: "DATA_GHOST",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md p-6 neon-border bg-black/40 backdrop-blur-md relative overflow-hidden group">
      {/* Visualizer bars (mock) */}
      <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-around px-2 opacity-20 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-neon-cyan"
            animate={{
              height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 neon-border flex items-center justify-center bg-neon-cyan/10 relative">
          <div className="absolute inset-0 bg-neon-cyan/5 animate-pulse" />
          <Music className="w-8 h-8 text-neon-cyan neon-icon" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-pixel text-[10px] text-neon-cyan truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="font-mono text-[10px] text-neon-cyan/40 mt-1 tracking-widest">SOURCE: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1 bg-white/10 mb-6 cursor-pointer overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-neon-cyan"
          style={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0 }}
        />
        <div className="absolute top-0 left-0 w-full h-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
      </div>

      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={prevTrack}
          className="p-2 text-neon-cyan hover:text-white transition-colors glitch-hover"
        >
          <SkipBack className="w-6 h-6 neon-icon" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 rounded-full neon-border flex items-center justify-center text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current neon-icon" /> : <Play className="w-6 h-6 fill-current ml-1 neon-icon" />}
        </button>

        <button 
          onClick={nextTrack}
          className="p-2 text-neon-cyan hover:text-white transition-colors glitch-hover"
        >
          <SkipForward className="w-6 h-6 neon-icon" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-neon-cyan/40 font-mono uppercase tracking-widest">
        <Volume2 className="w-3 h-3 neon-icon" />
        <span>AUDIO_STREAM_STABLE</span>
        <div className="flex-1 h-[1px] bg-neon-cyan/20 ml-2" />
      </div>
    </div>
  );
}
