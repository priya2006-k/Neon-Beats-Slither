import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Activity, Shield, Database, Wifi } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [booting, setBooting] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = [
      "0x00: KERNEL_LOAD_SUCCESS",
      "0x01: MEMORY_MAP_VERIFIED",
      "0x02: GRID_SYNC_INITIATED",
      "0x03: AUDIO_DECODER_ONLINE",
      "0x04: NEURAL_LINK_STABLE",
      "0x05: ACCESS_GRANTED"
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 1200);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen crt-screen flex flex-col items-center justify-center p-4 relative bg-black">
      <div className="noise-overlay" />
      
      <AnimatePresence mode="wait">
        {booting ? (
          <motion.div 
            key="boot"
            initial={{ opacity: 0, filter: "brightness(2)" }}
            animate={{ opacity: 1, filter: "brightness(1)" }}
            exit={{ opacity: 0, x: 100, filter: "blur(20px) hue-rotate(90deg)" }}
            className="w-full max-w-lg p-8 neon-border bg-black/90 font-mono text-neon-cyan screen-tear"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-neon-cyan/30 pb-4">
              <Terminal className="w-5 h-5 neon-icon" />
              <span className="text-xs tracking-[0.5em] uppercase font-pixel">SYS_BOOT_v4.0</span>
            </div>
            <div className="space-y-1 text-xs">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <span className="text-neon-cyan/20">[{i.toString(16).padStart(2, '0')}]</span>
                  <span className="glitch-hover">{log}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 h-[2px] bg-neon-cyan/10 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="main"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10"
          >
            {/* Left Sidebar - System Stats */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block screen-tear">
              <div className="p-4 neon-border bg-black/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-cyan/20 animate-pulse" />
                <div className="flex items-center gap-2 mb-4 text-[10px] text-neon-cyan uppercase tracking-[0.4em] font-pixel">
                  <Cpu className="w-3 h-3 neon-icon" />
                  <span>HW_METRICS</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "CORE_TEMP", val: "314K", icon: Activity },
                    { label: "DATA_FLOW", val: "8.4GB/s", icon: Database },
                    { label: "SIGNAL_STR", val: "99%", icon: Wifi },
                    { label: "ENCRYPTION", val: "AES_256", icon: Shield }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] border-b border-neon-cyan/5 pb-1">
                      <div className="flex items-center gap-2 text-neon-cyan/50">
                        <stat.icon className="w-2 h-2 neon-icon" />
                        <span>{stat.label}</span>
                      </div>
                      <span className="text-neon-cyan font-pixel">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 neon-border-magenta bg-black/60 backdrop-blur-sm glitch-heavy">
                <div className="flex items-center gap-2 mb-4 text-[10px] text-neon-magenta uppercase tracking-[0.4em] font-pixel">
                  <Zap className="w-3 h-3 neon-icon-magenta" />
                  <span>ENERGY_GRID</span>
                </div>
                <div className="h-20 flex items-end justify-between gap-[2px]">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-full bg-neon-magenta/40"
                      animate={{ height: [10, 60, 20, 50, 10] }}
                      transition={{ repeat: Infinity, duration: 1.5 + Math.random(), delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Game */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="mb-8 text-center relative">
                <div className="absolute -inset-4 bg-neon-cyan/5 blur-2xl rounded-full" />
                <h1 className="font-pixel text-3xl text-neon-cyan glitch-text mb-2 tracking-tighter" data-text="NEON_SNAKE_v4">NEON_SNAKE_v4</h1>
                <p className="text-neon-cyan/30 text-[9px] tracking-[0.6em] uppercase font-mono">GRID_STABILITY_PROTOCOL_ACTIVE</p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-neon-cyan/20 blur opacity-20" />
                <SnakeGame />
              </div>
            </div>

            {/* Right Sidebar - Music & Controls */}
            <div className="lg:col-span-3 space-y-6 screen-tear" style={{ animationDelay: '1s' }}>
              <MusicPlayer />
              
              <div className="p-4 neon-border bg-black/60 backdrop-blur-sm text-[9px] text-neon-cyan/30 leading-loose font-mono uppercase tracking-widest">
                <div className="text-neon-cyan/50 mb-3 border-b border-neon-cyan/20 pb-2 font-pixel text-[8px]">TERMINAL_OUTPUT</div>
                <p className="flex justify-between"><span>&gt; GRID_SYNC</span> <span className="text-neon-cyan">OK</span></p>
                <p className="flex justify-between"><span>&gt; AUDIO_INIT</span> <span className="text-neon-cyan">OK</span></p>
                <p className="flex justify-between"><span>&gt; NEURAL_LINK</span> <span className="text-neon-cyan">STABLE</span></p>
                <p className="flex justify-between"><span>&gt; INPUT_WAIT</span> <span className="animate-pulse text-neon-magenta">...</span></p>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center text-[8px] text-neon-cyan/10 font-mono uppercase tracking-[1em] pointer-events-none z-50">
        <span className="glitch-hover">PRIYA_KONGARA_SYSTEMS_v4.0.1</span>
        <span className="glitch-hover">TIMESTAMP_2026_03_25</span>
      </div>
    </div>
  );
}
