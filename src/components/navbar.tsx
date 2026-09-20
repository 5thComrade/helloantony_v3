import { motion } from "motion/react";

type PortfolioNavbarProps = {
  show: boolean;
  showName: boolean;
  useSharedName: boolean;
};

const FULL_NAME = "ANTONY CHIRAMEL";

export function PortfolioNavbar({
  show,
  showName,
  useSharedName,
}: Readonly<PortfolioNavbarProps>) {
  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <div className="h-px w-8 bg-border md:w-12" aria-hidden />

        <div className="min-w-0">
          {showName ? (
            useSharedName ? (
              <motion.span
                layoutId="portfolio-name"
                className="block truncate text-sm font-semibold uppercase tracking-[0.12em] text-foreground sm:text-base"
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                  mass: 0.9,
                }}
              >
                {FULL_NAME}
              </motion.span>
            ) : (
              <span className="block truncate text-sm font-semibold uppercase tracking-[0.12em] text-foreground sm:text-base">
                {FULL_NAME}
              </span>
            )
          ) : null}
        </div>

        <div className="h-px w-8 bg-border md:w-12" aria-hidden />
      </div>
    </motion.header>
  );
}
