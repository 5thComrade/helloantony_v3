import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type PortfolioLoaderProps = {
  isReducedMotion: boolean;
  onLiftOff: () => void;
  onFinished: () => void;
};

const FULL_NAME = "Antony Chiramel";
const NAME_CHARACTERS = Array.from(FULL_NAME).map((char, order) => ({
  char,
  order,
  id: `${char === " " ? "space" : char}-${order}`,
}));

export function PortfolioLoader({
  isReducedMotion,
  onLiftOff,
  onFinished,
}: Readonly<PortfolioLoaderProps>) {
  const [progress, setProgress] = useState(0);
  const [hideProgress, setHideProgress] = useState(false);
  const [liftedOff, setLiftedOff] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasTriggeredSequence = useRef(false);
  const progressRatio = progress / 100;
  const revealPhase = Math.min(progressRatio / 0.2, 1);
  const quietPhase = progressRatio <= 0.8 ? 0 : (progressRatio - 0.8) / 0.2;
  const atmosphereOpacity = isReducedMotion
    ? 0.55
    : Math.max(0.2, revealPhase * (1 - quietPhase * 0.72));

  useEffect(() => {
    if (isReducedMotion) {
      const quickShow = window.setTimeout(() => {
        setProgress(100);
        setHideProgress(true);
        setIsExiting(true);
      }, 320);

      const quickFinish = window.setTimeout(() => {
        onFinished();
      }, 620);

      return () => {
        window.clearTimeout(quickShow);
        window.clearTimeout(quickFinish);
      };
    }

    const durationMs = 3400;
    const intervalMs = 34;
    const totalSteps = 100;
    const startedAt = performance.now();

    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const linear = Math.min(elapsed / durationMs, 1);
      const nextProgress = Math.min(
        totalSteps,
        Math.floor(linear * totalSteps),
      );

      setProgress((prev) => (nextProgress > prev ? nextProgress : prev));

      if (linear >= 1) {
        setProgress(100);
        window.clearInterval(intervalId);
      }
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isReducedMotion, onFinished]);

  useEffect(() => {
    if (isReducedMotion || progress < 100 || hasTriggeredSequence.current) {
      return;
    }

    hasTriggeredSequence.current = true;

    const hideProgressTimeout = window.setTimeout(() => {
      setHideProgress(true);
    }, 120);

    const liftOffTimeout = window.setTimeout(() => {
      setLiftedOff(true);
      onLiftOff();
    }, 380);

    const exitTimeout = window.setTimeout(() => {
      setIsExiting(true);
    }, 520);

    const finishTimeout = window.setTimeout(() => {
      onFinished();
    }, 1180);

    return () => {
      window.clearTimeout(hideProgressTimeout);
      window.clearTimeout(liftOffTimeout);
      window.clearTimeout(exitTimeout);
      window.clearTimeout(finishTimeout);
    };
  }, [isReducedMotion, onFinished, onLiftOff, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: isReducedMotion ? 0.22 : 0.72,
        ease: [0.4, 0, 0.2, 1],
      }}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: atmosphereOpacity,
          backgroundImage:
            "radial-gradient(circle at 52% 49%, color-mix(in oklch, var(--foreground) 8%, transparent) 0%, transparent 58%), radial-gradient(circle at 49% 56%, color-mix(in oklch, var(--muted) 20%, transparent) 0%, transparent 62%)",
        }}
        animate={
          isReducedMotion
            ? undefined
            : {
                backgroundPosition: [
                  "52% 49%, 49% 56%",
                  "50% 52%, 51% 54%",
                  "52% 49%, 49% 56%",
                ],
              }
        }
        transition={{
          duration: 8.4,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: atmosphereOpacity * 0.65,
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--foreground) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 7%, transparent) 1px, transparent 1px)",
          backgroundSize: "min(9vw,64px) min(9vw,64px)",
        }}
        animate={
          isReducedMotion
            ? undefined
            : {
                backgroundPosition: [
                  "0px 0px, 0px 0px",
                  "10px 0px, 0px 8px",
                  "0px 0px, 0px 0px",
                ],
                opacity: [
                  atmosphereOpacity * 0.54,
                  atmosphereOpacity * 0.7,
                  atmosphereOpacity * 0.54,
                ],
              }
        }
        transition={{
          duration: 11,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 hidden sm:block"
        style={{
          opacity: atmosphereOpacity * 0.22,
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "min(22vw,220px) min(22vw,220px)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute right-[-8%] top-[14%] text-[clamp(8rem,22vw,24rem)] font-semibold uppercase leading-[0.78] tracking-[0.08em] text-foreground/5"
        initial={{ opacity: 0 }}
        animate={
          isReducedMotion
            ? { opacity: 0.08, y: 0 }
            : { opacity: atmosphereOpacity * 0.2, y: [0, -10, 0] }
        }
        transition={{
          duration: 12,
          ease: "easeInOut",
          repeat: isReducedMotion ? 0 : Number.POSITIVE_INFINITY,
        }}
      >
        ANTONY
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-[-10%] bottom-[8%] text-[clamp(7rem,18vw,18rem)] font-semibold uppercase leading-[0.8] tracking-[0.1em] text-foreground/4"
        initial={{ opacity: 0 }}
        animate={
          isReducedMotion
            ? { opacity: 0.06, x: 0 }
            : { opacity: atmosphereOpacity * 0.17, x: [0, 8, 0] }
        }
        transition={{
          duration: 10.5,
          ease: "easeInOut",
          repeat: isReducedMotion ? 0 : Number.POSITIVE_INFINITY,
        }}
      >
        AC
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-2/3 bg-linear-to-r from-transparent via-foreground/8 to-transparent"
        initial={{ opacity: 0 }}
        animate={
          isReducedMotion
            ? { opacity: 0 }
            : {
                x: ["0%", "210%"],
                opacity: [0, atmosphereOpacity * 0.3, 0],
              }
        }
        transition={{
          duration: 3.8,
          ease: [0.3, 0.1, 0.2, 1],
          times: [0, 0.5, 1],
          repeat: 1,
          repeatDelay: 0.8,
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: atmosphereOpacity * 0.2,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in oklch, var(--foreground) 12%, transparent) 0.8px, transparent 0.9px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_42%,color-mix(in_oklch,var(--foreground)_11%,transparent)_100%)]" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={
          isReducedMotion ? { opacity: 0.3 } : { opacity: [0.24, 0.33, 0.24] }
        }
        transition={{
          duration: 6.5,
          repeat: isReducedMotion ? 0 : Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="absolute left-4 top-4 h-3 w-3 border-l border-t border-border/60 md:left-6 md:top-6" />
        <div className="absolute right-4 top-4 h-3 w-3 border-r border-t border-border/60 md:right-6 md:top-6" />
        <div className="absolute bottom-4 left-4 h-3 w-3 border-b border-l border-border/60 md:bottom-6 md:left-6" />
        <div className="absolute bottom-4 right-4 h-3 w-3 border-b border-r border-border/60 md:bottom-6 md:right-6" />
      </motion.div>

      <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
        <motion.div
          className="pointer-events-none absolute left-6 top-9 hidden text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/80 md:block"
          animate={{ opacity: hideProgress ? 0 : 1 }}
          transition={{ duration: 0.35 }}
        >
          <p>PORTFOLIO / 2026</p>
          <div className="mt-2 h-px w-24 bg-border/55" />
          <p className="mt-2">INITIALIZING</p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-9 left-6 hidden text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground/75 md:block"
          animate={{ opacity: hideProgress ? 0 : 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-2 h-px w-16 bg-border/50" />
          <p>01 / LOADER</p>
        </motion.div>

        <AnimatePresence>
          {!liftedOff && !isReducedMotion ? (
            <motion.h1
              key="loader-name"
              layoutId="portfolio-name"
              className="max-w-[96vw] whitespace-nowrap text-center text-[clamp(1.45rem,8vw,7rem)] font-semibold uppercase leading-[0.95] text-foreground"
              initial={{
                opacity: 0,
                y: 20,
                filter: "blur(12px)",
                letterSpacing: "clamp(0.06em,0.95vw,0.22em)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                letterSpacing: "clamp(0.04em,0.6vw,0.14em)",
                textShadow: [
                  "0 0 0px color-mix(in oklch, var(--foreground) 0%, transparent)",
                  "0 0 24px color-mix(in oklch, var(--foreground) 22%, transparent)",
                  "0 0 0px color-mix(in oklch, var(--foreground) 0%, transparent)",
                ],
              }}
              exit={{ opacity: 0.9, filter: "blur(0px)" }}
              transition={{
                opacity: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] },
                y: { type: "spring", stiffness: 130, damping: 20 },
                filter: { duration: 0.8 },
                letterSpacing: { duration: 0.8 },
                textShadow: {
                  duration: 3.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
            >
              {NAME_CHARACTERS.map(({ char, id, order }) => (
                <motion.span
                  key={id}
                  className="inline-block"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.18 + order * 0.032,
                    duration: 0.55,
                    ease: [0.2, 0.65, 0.2, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
          ) : null}

          {isReducedMotion ? (
            <motion.h1
              key="loader-name-reduced"
              className="max-w-[96vw] whitespace-nowrap text-center text-[clamp(1.45rem,8vw,7rem)] font-semibold uppercase leading-[0.95] tracking-[clamp(0.04em,0.6vw,0.14em)] text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {FULL_NAME}
            </motion.h1>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {!hideProgress ? (
            <motion.div
              key="loader-progress"
              className="absolute bottom-10 right-6 md:bottom-12 md:right-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            >
              <p className="mb-1 text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground/75">
                Loading
              </p>
              <div className="mb-2 h-px w-18 bg-border/55 md:w-24" />
              <p className="text-xl font-medium tabular-nums tracking-[0.14em] text-muted-foreground md:text-2xl">
                {String(progress).padStart(2, "0")}%
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
