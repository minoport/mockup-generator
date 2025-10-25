import React, { useRef, useEffect, useCallback } from "react";

export interface ImageTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface MockupCanvasProps {
  baseImage: string;
  designImage: string | null;
  transform: ImageTransform;
  onTransformChange: (transform: ImageTransform) => void;
}

const MockupCanvas: React.FC<MockupCanvasProps> = ({
  baseImage,
  designImage,
  transform,
  onTransformChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImgRef = useRef<HTMLImageElement | null>(null);
  const designImgRef = useRef<HTMLImageElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    if (baseImgRef.current) {
      ctx.drawImage(baseImgRef.current, 0, 0, canvas.width, canvas.height);
    }

    // Draw design image with transformations
    if (designImgRef.current) {
      ctx.save();

      // Apply transformations
      ctx.translate(
        transform.x + canvas.width / 2,
        transform.y + canvas.height / 2
      );
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.scale(transform.scale, transform.scale);

      const designWidth = designImgRef.current.width;
      const designHeight = designImgRef.current.height;

      ctx.drawImage(
        designImgRef.current,
        -designWidth / 2,
        -designHeight / 2,
        designWidth,
        designHeight
      );

      ctx.restore();
    }
  }, [transform]);

  // Load and draw images
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load base image
    const baseImg = new Image();
    baseImg.src = baseImage;
    baseImg.onload = () => {
      baseImgRef.current = baseImg;
      drawCanvas();
    };

    // Load design image if available
    if (designImage) {
      const designImg = new Image();
      designImg.src = designImage;
      designImg.onload = () => {
        designImgRef.current = designImg;
        drawCanvas();
      };
    }
  }, [baseImage, designImage, drawCanvas]);

  // Redraw when transform changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!designImage) return;

    isDraggingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !designImage) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const deltaX = currentX - lastPositionRef.current.x;
      const deltaY = currentY - lastPositionRef.current.y;

      onTransformChange({
        ...transform,
        x: transform.x + deltaX,
        y: transform.y + deltaY,
      });

      lastPositionRef.current = { x: currentX, y: currentY };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="mockup-canvas-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={700}
        className="mockup-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: designImage ? "move" : "default" }}
      />
    </div>
  );
};

export default MockupCanvas;
