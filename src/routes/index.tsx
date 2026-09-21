import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LayoutGroup, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { Hero } from "@/components/hero";
import { PortfolioNavbar } from "@/components/navbar";
import { PortfolioLoader } from "@/components/portfolio-loader";

let hasSeenPortfolioLoaderInApp = false;

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [loaderFinished, setLoaderFinished] = useState(
    hasSeenPortfolioLoaderInApp,
  );
  const [liftOffStarted, setLiftOffStarted] = useState(false);

  const showNavbarName = useMemo(
    () => prefersReducedMotion || liftOffStarted || loaderFinished,
    [liftOffStarted, loaderFinished, prefersReducedMotion],
  );

  const handleLiftOff = useCallback(() => {
    setLiftOffStarted(true);
  }, []);

  const handleLoaderFinished = useCallback(() => {
    hasSeenPortfolioLoaderInApp = true;
    setLoaderFinished(true);
  }, []);

  const handleOpenChat = useCallback(() => {
    void navigate({ to: "/chat" });
  }, [navigate]);

  return (
    <LayoutGroup id="portfolio-loader-sequence">
      <div className="relative min-h-svh overflow-hidden bg-background">
        <PortfolioNavbar
          show={loaderFinished || liftOffStarted || prefersReducedMotion}
          showName={showNavbarName}
          useSharedName={!prefersReducedMotion}
        />

        <Hero onAsk={handleOpenChat} />

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
