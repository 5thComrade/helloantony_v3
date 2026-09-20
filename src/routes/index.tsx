import { createFileRoute } from "@tanstack/react-router";
import { LayoutGroup, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { Hero } from "@/components/hero";
import { PortfolioNavbar } from "@/components/navbar";
import { PortfolioLoader } from "@/components/portfolio-loader";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [loaderFinished, setLoaderFinished] = useState(false);
  const [liftOffStarted, setLiftOffStarted] = useState(false);

  const showNavbarName = useMemo(
    () => prefersReducedMotion || liftOffStarted || loaderFinished,
    [liftOffStarted, loaderFinished, prefersReducedMotion],
  );

  const handleLiftOff = useCallback(() => {
    setLiftOffStarted(true);
  }, []);

  const handleLoaderFinished = useCallback(() => {
    setLoaderFinished(true);
  }, []);

  return (
    <LayoutGroup id="portfolio-loader-sequence">
      <div className="relative min-h-svh overflow-hidden bg-background">
        <PortfolioNavbar
          show={loaderFinished || liftOffStarted || prefersReducedMotion}
          showName={showNavbarName}
          useSharedName={!prefersReducedMotion}
        />

        <Hero show={loaderFinished || prefersReducedMotion} />

        {!loaderFinished ? (
          <PortfolioLoader
            isReducedMotion={prefersReducedMotion}
            onLiftOff={handleLiftOff}
            onFinished={handleLoaderFinished}
          />
        ) : null}
      </div>
    </LayoutGroup>
  );
}
