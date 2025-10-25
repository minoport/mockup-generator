import React from "react";
import type { ImageTransform } from "./MockupCanvas";

interface MockupControlsProps {
  transform: ImageTransform;
  onTransformChange: (transform: ImageTransform) => void;
  onReset: () => void;
  onDownload: () => void;
  onRegenerate?: () => void;
}

const MockupControls: React.FC<MockupControlsProps> = ({
  transform,
  onTransformChange,
  onReset,
  onDownload,
  onRegenerate,
}) => {
  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTransformChange({
      ...transform,
      scale: parseFloat(e.target.value),
    });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTransformChange({
      ...transform,
      rotation: parseFloat(e.target.value),
    });
  };

  const handleScaleButton = (delta: number) => {
    onTransformChange({
      ...transform,
      scale: Math.max(0.1, Math.min(3, transform.scale + delta)),
    });
  };

  const handleRotateButton = (delta: number) => {
    onTransformChange({
      ...transform,
      rotation: (transform.rotation + delta) % 360,
    });
  };

  return (
    <div className="mockup-controls">
      <div className="control-section">
        <h3>🔍 Phóng to / Thu nhỏ</h3>
        <div className="control-group">
          <button onClick={() => handleScaleButton(-0.01)}>−</button>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.01"
            value={transform.scale}
            onChange={handleScaleChange}
          />
          <button onClick={() => handleScaleButton(0.01)}>+</button>
          <span className="value-display">
            {(transform.scale * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="control-section">
        <h3>🔄 Xoay</h3>
        <div className="control-group">
          <button onClick={() => handleRotateButton(-15)}>↺</button>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={transform.rotation}
            onChange={handleRotationChange}
          />
          <button onClick={() => handleRotateButton(15)}>↻</button>
          <span className="value-display">
            {transform.rotation.toFixed(0)}°
          </span>
        </div>
      </div>

      <div className="control-section">
        <h3>💡 Hướng dẫn</h3>
        <p className="hint">Kéo thả trên canvas để di chuyển design</p>
      </div>

      <div className="action-buttons">
        {onRegenerate && (
          <button className="regenerate-button" onClick={onRegenerate}>
            🔄 Tạo lại Mockup
          </button>
        )}
        <button className="reset-button" onClick={onReset}>
          ↺ Reset vị trí
        </button>
        <button className="download-button" onClick={onDownload}>
          💾 Tải xuống
        </button>
      </div>
    </div>
  );
};

export default MockupControls;
