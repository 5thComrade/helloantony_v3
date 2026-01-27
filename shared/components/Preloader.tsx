"use client";

import { motion } from "motion/react";

interface PreloaderProps {
  progress: number;
}

export default function Preloader({ progress }: PreloaderProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F1110] text-[#E7E3DA]"
    >
      <div className="w-64 space-y-4">
        <div className="flex justify-between font-sans text-sm font-medium tracking-widest uppercase">
          <span>Loading Narrative</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-px w-full bg-[#333]">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#E7E3DA]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
