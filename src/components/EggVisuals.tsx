import React from 'react';
import { motion } from 'motion/react';

interface EggProps {
  className?: string;
  isActive?: boolean;
}

export const SoftEgg = ({ className, isActive }: EggProps) => (
  <motion.svg
    viewBox="0 0 200 240"
    className={className}
    animate={isActive ? { y: [0, -5, 0], scale: [1, 1.02, 1] } : {}}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    {/* White Base */}
    <ellipse cx="100" cy="140" rx="60" ry="80" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    
    {/* Runny Yolk */}
    <circle cx="100" cy="150" r="35" fill="#facc15" />
    <motion.path
      d="M85,175 Q100,200 115,175"
      fill="none"
      stroke="#facc15"
      strokeWidth="8"
      strokeLinecap="round"
      animate={{ height: [5, 15, 5] }}
    />
    
    {/* Cute Face */}
    <circle cx="85" cy="145" r="3" fill="#334155" />
    <circle cx="115" cy="145" r="3" fill="#334155" />
    <path d="M95,155 Q100,160 105,155" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
    <circle cx="80" cy="152" r="4" fill="#fda4af" opacity="0.4" />
    <circle cx="120" cy="152" r="4" fill="#fda4af" opacity="0.4" />
  </motion.svg>
);

export const MediumEgg = ({ className, isActive }: EggProps) => (
  <motion.svg
    viewBox="0 0 200 240"
    className={className}
    animate={isActive ? { rotate: [-1, 1, -1] } : {}}
    transition={{ repeat: Infinity, duration: 1.5 }}
  >
    <ellipse cx="100" cy="140" rx="60" ry="80" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    
    {/* Jammy Yolk */}
    <circle cx="100" cy="150" r="38" fill="#fb923c" />
    <circle cx="100" cy="150" r="25" fill="#f59e0b" opacity="0.6" />
    
    {/* Cute Face */}
    <path d="M80,145 Q85,140 90,145" fill="none" stroke="#334155" strokeWidth="2" />
    <path d="M110,145 Q115,140 120,145" fill="none" stroke="#334155" strokeWidth="2" />
    <circle cx="100" cy="160" r="5" fill="#be123c" />
    <circle cx="75" cy="155" r="5" fill="#fda4af" opacity="0.5" />
    <circle cx="125" cy="155" r="5" fill="#fda4af" opacity="0.5" />
  </motion.svg>
);

export const HardEgg = ({ className, isActive }: EggProps) => (
  <motion.svg
    viewBox="0 0 200 240"
    className={className}
    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
    transition={{ repeat: Infinity, duration: 1 }}
  >
    <ellipse cx="100" cy="140" rx="60" ry="80" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    
    {/* Solid Yolk */}
    <circle cx="100" cy="150" r="40" fill="#fbbf24" />
    
    {/* Cute Face */}
    <motion.path 
      d="M85,140 L90,145 L85,150" 
      fill="none" 
      stroke="#334155" 
      strokeWidth="2" 
      animate={isActive ? { x: [-1, 1, -1] } : {}}
    />
    <motion.path 
      d="M115,140 L110,145 L115,150" 
      fill="none" 
      stroke="#334155" 
      strokeWidth="2"
      animate={isActive ? { x: [1, -1, 1] } : {}}
    />
    <rect x="95" y="158" width="10" height="4" rx="2" fill="#334155" />
  </motion.svg>
);
