import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  onAsk: () => void;
};

export function Hero({ onAsk }: Readonly<HeroProps>) {
  return (
    <motion.main
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-32 md:px-10 md:pt-36"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.section
        className="max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Software Engineer
        </p>

        <h1 className="mt-5 text-[clamp(2.25rem,8vw,5.6rem)] font-semibold leading-[0.94] tracking-tight text-foreground">
          Antony Chiramel
        </h1>

        <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Building intentional digital products with strong engineering
          foundations, refined interactions, and modern web performance.
        </p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            size="lg"
            className="rounded-full px-5 text-sm tracking-[0.04em]"
            onClick={onAsk}
          >
            Ask me anything
          </Button>
        </motion.div>
      </motion.section>
    </motion.main>
  );
}
