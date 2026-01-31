"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import useImagePreloader from "@/shared/hooks/useImagePreloader";
import ScrollCanvas from "@/shared/components/ScrollCanvas";
// import Preloader from './Preloader'; // Your existing preloader

const FRAME_COUNT = 120;

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null); // container ref

  // 1. Setup Image Loading
  const { images, isLoading, progress } = useImagePreloader(
    FRAME_COUNT,
    (index) => `/frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`
  );

  // 2. Scroll Hooks
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3. Text Animations (Cleaned up with a helper function or inline)
  // Using useTransform directly keeps it readable
  const textAnims = {
    slide1: useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]),
    slide2: useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]),
    slide3: useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]),
    slide4: useTransform(scrollYProgress, [0.75, 0.8, 1], [0, 1, 1]),
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          // Replace with your actual Preloader component
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white"
          >
            Loading {progress}%
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="relative h-[600vh]"
        style={{
          background: "linear-gradient(to right, #6c8776 50%, #5e7d6b 50%)",
        }}
      >
        {/* The Visuals */}
        <ScrollCanvas
          scrollProgress={scrollYProgress}
          images={images}
          isLoading={isLoading}
        />

        {/* The Overlay Content */}
        <div className="pointer-events-none fixed inset-0 z-10">
          <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 md:px-20">
            {/* Text 1: Centered */}
            <motion.div
              style={{ opacity: textAnims.slide1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h2 className="font-display text-center text-3xl text-[#E7E3DA] md:text-5xl">
                Not everyone was chosen.
                <br />
                Some chose to follow.
              </h2>
            </motion.div>

            {/* Text 2: Left */}
            <motion.div
              style={{ opacity: textAnims.slide2 }}
              className="absolute inset-0 flex items-center justify-start"
            >
              <h2 className="font-display text-left text-3xl text-[#E7E3DA] md:text-5xl">
                The path was never meant
                <br />
                to be watched.
              </h2>
            </motion.div>

            {/* Text 3: Right */}
            <motion.div
              style={{ opacity: textAnims.slide3 }}
              className="absolute inset-0 flex items-center justify-end"
            >
              <h2 className="font-display text-right text-3xl text-[#E7E3DA] md:text-5xl">
                Walking forward often
                <br />
                means walking alone.
              </h2>
            </motion.div>

            {/* Text 4: CTA */}
            <motion.div
              style={{ opacity: textAnims.slide4 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <h1 className="font-display mb-8 text-6xl text-[#E7E3DA] md:text-8xl">
                13th Apostle
              </h1>
              <button className="pointer-events-auto bg-[#E7E3DA] px-8 py-3 font-sans font-medium text-[#0F1110] uppercase transition-colors hover:bg-white">
                Enter Collection
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
