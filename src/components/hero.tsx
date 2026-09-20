import { motion } from "motion/react";

type HeroProps = {
  show: boolean;
};

export function Hero({ show }: Readonly<HeroProps>) {
  return (
    <motion.main
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 pb-16 pt-32 md:px-10 md:pt-36"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.section
        className="max-w-3xl"
        initial={false}
        animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
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
      </motion.section>
    </motion.main>
  );
}
