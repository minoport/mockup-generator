import { useState } from "react";
import type { ImageTransform } from "../components/MockupCanvas";

const initialTransform: ImageTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
};

export const useImageTransform = () => {
  const [transform, setTransform] = useState<ImageTransform>(initialTransform);

  const resetTransform = () => {
    setTransform(initialTransform);
  };

  return {
    transform,
    setTransform,
    resetTransform,
  };
};
