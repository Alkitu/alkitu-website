'use client';
import { motion } from 'framer-motion';

interface BasicSwitchProps {
  isOn: boolean;
  setIsOn: (isOn: boolean) => void;
}

export default function BasicSwitch({ isOn, setIsOn }: BasicSwitchProps) {
  return (
    <motion.div
      animate
      className={`w-20 h-7 rounded-full cursor-pointer flex ${
        isOn ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
      }`}
      onClick={() => setIsOn(!isOn)}
    >
      <motion.div className='w-6 h-6 bg-zinc-100 rounded-full shadow-xs my-auto mx-1' animate />
    </motion.div>
  );
}
