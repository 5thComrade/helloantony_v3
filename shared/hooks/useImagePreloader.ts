import { useState, useEffect } from "react";

export default function useImagePreloader(
  frameCount: number,
  pathResolver: (index: number) => string
) {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const loadBatch = async () => {
      // Create placeholders immediately so index mapping works
      for (let i = 0; i < frameCount; i++) {
        loadedImages[i] = new Image();
      }

      // Load images in parallel (browser limits concurrent requests automatically)
      const promises = loadedImages.map((img, i) => {
        return new Promise<void>((resolve) => {
          img.src = pathResolver(i + 1); // 1-based index

          img.onload = () => {
            if (!isMounted) return;
            loadedCount++;
            setProgress(Math.round((loadedCount / frameCount) * 100));
            resolve();
          };

          img.onerror = () => {
            console.error(`Failed to load frame ${i + 1}`);
            resolve(); // Resolve anyway to keep progress moving
          };
        });
      });

      await Promise.all(promises);

      if (isMounted) {
        setImages(loadedImages);
        setIsLoading(false);
      }
    };

    loadBatch();

    return () => {
      isMounted = false;
    };
  }, [frameCount, pathResolver]);

  return { images, progress, isLoading };
}
