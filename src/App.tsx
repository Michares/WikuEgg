/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Egg, 
  Flame, 
  Bell, 
  Info,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoftEgg, MediumEgg, HardEgg } from './components/EggVisuals';

// Types for Egg Stages
type EggStage = 'soft' | 'medium' | 'hard';

interface StageConfig {
  id: EggStage;
  label: string;
  description: string;
  timeInSeconds: number;
  color: string;
  emoji: string;
  gradient: string;
}

const EGG_STAGES: StageConfig[] = [
  {
    id: 'soft',
    label: 'Setengah Matang',
    description: 'Kuning telur cair, putih telur lembut.',
    timeInSeconds: 360, // 6 minutes
    color: 'bg-yellow-100',
    emoji: '🥚',
    gradient: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'medium',
    label: 'Matang Sedang',
    description: 'Kuning telur kental (jammy), putih matang.',
    timeInSeconds: 480, // 8 minutes
    color: 'bg-orange-100',
    emoji: '🍳',
    gradient: 'from-orange-400 to-red-400',
  },
  {
    id: 'hard',
    label: 'Matang Sempurna',
    description: 'Kuning telur padat, putih telur kokoh.',
    timeInSeconds: 600, // 10 minutes
    color: 'bg-red-100',
    emoji: '🍗',
    gradient: 'from-red-400 to-rose-500',
  },
];

export default function App() {
  const [selectedStage, setSelectedStage] = useState<StageConfig>(EGG_STAGES[0]);
  const [timeLeft, setTimeLeft] = useState<number>(EGG_STAGES[0].timeInSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play sound
  const playNotification = () => {
    if (!isSoundEnabled) return;
    
    try {
      // Use speech synthesis for a friendly "Telur sudah matang!"
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Hooray! Telur ${selectedStage.label} kamu sudah matang!`;
      msg.lang = 'id-ID';
      window.speechSynthesis.speak(msg);

      // Also a simple beep using AudioContext (fallback/addition)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5); // C6

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Sound could not be played', e);
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      playNotification();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(selectedStage.timeInSeconds);
  };

  const handleStageSelect = (stage: StageConfig) => {
    if (isActive) return;
    setSelectedStage(stage);
    setTimeLeft(stage.timeInSeconds);
    setIsFinished(false);
  };

  // Progress percentage
  const progress = ((selectedStage.timeInSeconds - timeLeft) / selectedStage.timeInSeconds) * 100;

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-slate-800 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg rotate-12">
            <Egg className="text-white w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-amber-900">
            Wiku<span className="text-orange-500">Egg</span>
          </h1>
        </div>
        <p className="text-amber-700 font-medium italic">Timernya telur rebus anti gagal! ✨</p>
      </motion.header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Timer & Visual */}
        <section className="bg-white rounded-3xl p-8 shadow-xl shadow-amber-200/50 flex flex-col items-center relative overflow-hidden border-4 border-amber-100">
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-amber-600"
              title={isSoundEnabled ? "Matikan Suara" : "Aktifkan Suara"}
            >
              {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>

          {/* Progress Circular Display */}
          <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 scale-110">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-amber-50"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray="691.15" // 2 * pi * 110
                initial={{ strokeDashoffset: 691.15 }}
                animate={{ strokeDashoffset: 691.15 - (691.15 * progress) / 100 }}
                transition={{ duration: 1, ease: 'linear' }}
                className={`text-transparent ${selectedStage.id === 'soft' ? 'text-yellow-400' : selectedStage.id === 'medium' ? 'text-orange-400' : 'text-rose-500'}`}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFinished ? 'finished' : selectedStage.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  {isFinished ? (
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-7xl mb-2"
                    >
                      🎊
                    </motion.div>
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center">
                      {selectedStage.id === 'soft' && <SoftEgg isActive={isActive} className="w-full h-full" />}
                      {selectedStage.id === 'medium' && <MediumEgg isActive={isActive} className="w-full h-full" />}
                      {selectedStage.id === 'hard' && <HardEgg isActive={isActive} className="w-full h-full" />}
                    </div>
                  )}
                  <span className={`text-4xl font-black font-mono transition-colors mt-[-20px] ${isActive ? 'text-orange-600' : 'text-slate-700'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 w-full justify-center mt-4">
            {!isFinished ? (
              <>
                {!isActive ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="flex-1 max-w-[150px] bg-amber-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
                  >
                    <Play fill="currentColor" size={20} /> Mulai
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePause}
                    className="flex-1 max-w-[150px] bg-slate-100 text-slate-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-slate-200"
                  >
                    <Pause fill="currentColor" size={20} /> Jeda
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all border-2 border-slate-200"
                >
                  <RotateCcw size={24} />
                </motion.button>
              </>
            ) : (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
              >
                <CheckCircle2 size={24} /> Siap Diangkat! Reset?
              </motion.button>
            )}
          </div>

          {/* Cooking Status Text */}
          <div className="mt-8 text-center">
            {isActive && (
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 text-orange-500 font-bold"
              >
                <Flame size={18} className="animate-bounce" />
                <span>Sedang memasak...</span>
              </motion.div>
            )}
            {isFinished && (
              <div className="text-green-600 font-bold text-xl">
                Matang! Selamat Makan! 😋
              </div>
            )}
          </div>
        </section>

        {/* Right Side: Options & Tips */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2 px-2">
              <Timer className="text-orange-500" /> Pilih Tingkat Kematangan
            </h3>
            {EGG_STAGES.map((stage) => (
              <motion.button
                key={stage.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStageSelect(stage)}
                disabled={isActive}
                className={`
                  p-5 rounded-3xl text-left transition-all relative overflow-hidden border-2
                  ${selectedStage.id === stage.id 
                    ? 'border-amber-400 bg-white shadow-xl shadow-amber-200/50' 
                    : 'border-transparent bg-amber-100/50 hover:bg-amber-100 opacity-70'}
                  ${isActive ? 'cursor-not-allowed hidden md:block' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${stage.color}`}>
                    {stage.id === 'soft' && <SoftEgg className="w-full h-full" />}
                    {stage.id === 'medium' && <MediumEgg className="w-full h-full" />}
                    {stage.id === 'hard' && <HardEgg className="w-full h-full" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-amber-900">{stage.label}</h4>
                    <p className="text-sm text-amber-700 leading-tight">{stage.description}</p>
                    <span className="text-xs font-black mt-1 inline-block px-2 py-0.5 bg-white rounded-full text-amber-600 shadow-sm">
                      {stage.timeInSeconds / 60} Menit
                    </span>
                  </div>
                </div>
                {selectedStage.id === stage.id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${stage.gradient}`}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Tips Card */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 text-blue-900">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Info size={18} className="text-blue-500" /> Tips Rebus Telur
            </h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• Masukkan telur saat air sudah mendidih.</li>
              <li>• Gunakan api sedang agar telur tidak retak.</li>
              <li>• Segera masukkan telur ke **air es** setelah matang agar mudah dikupas! 🧊</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="mt-auto pt-8 text-amber-700/50 text-sm font-medium">
        Dibuat dengan ❤️ untuk pecinta telur rebus
      </footer>
    </div>
  );
}
