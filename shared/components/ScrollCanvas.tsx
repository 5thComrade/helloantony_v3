import { useRef, useEffect, useMemo, useState } from "react";
import { MotionValue, useMotionValueEvent } from "motion/react";

interface ScrollCanvasProps {
  scrollProgress: MotionValue<number>; // 0 to 1
  images: HTMLImageElement[];
  isLoading: boolean;
}

export default function ScrollCanvas({
  scrollProgress,
  images,
  isLoading,
}: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // 1. Handle Resize & Layout Calculation (Runs only on resize)
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Set canvas buffer size to match screen density (Retina support)
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;

        setCanvasSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Pre-calculate drawing dimensions to avoid math on every scroll tick
  // This logic mimics 'object-contain'. Change ratio math for 'object-cover'.
  const drawDimensions = useMemo(() => {
    if (images.length === 0 || canvasSize.width === 0) return null;

    const img = images[0]; // Assume all images are same size
    const dpr = window.devicePixelRatio || 1;
    const canvasW = canvasSize.width * dpr;
    const canvasH = canvasSize.height * dpr;

    // "contain" logic
    const hRatio = canvasW / img.width;
    const vRatio = canvasH / img.height;
    const ratio = Math.min(hRatio, vRatio); // Use Math.max for object-cover

    const width = img.width * ratio;
    const height = img.height * ratio;
    const x = (canvasW - width) / 2;
    const y = (canvasH - height) / 2;

    return { x, y, width, height };
  }, [canvasSize, images]);

  // 3. The Render Loop
  const render = (progress: number) => {
    if (!canvasRef.current || images.length === 0 || !drawDimensions) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Map 0-1 progress to Frame Index
    const totalFrames = images.length - 1;
    const frameIndex = Math.min(
      totalFrames,
      Math.max(0, Math.round(progress * totalFrames))
    );

    const img = images[frameIndex];
    if (!img) return;

    // Clear and Draw
    // Note: We don't need to clearRect if using 'cover', but 'contain' needs it
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.drawImage(
      img,
      drawDimensions.x,
      drawDimensions.y,
      drawDimensions.width,
      drawDimensions.height
    );
  };

  // 4. Bind to MotionValue
  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (!isLoading) requestAnimationFrame(() => render(latest));
  });

  // Initial draw
  useEffect(() => {
    if (!isLoading) render(scrollProgress.get());
  }, [isLoading, drawDimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="sticky top-0 h-screen w-full"
      style={{
        width: "100%",
        height: "100vh",
        objectFit: "contain", // CSS fallback
      }}
    />
  );
}
