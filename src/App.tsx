import { useState } from "react";
import "./App.css";
import ImageUploader from "./components/ImageUploader";
import MockupCanvas from "./components/MockupCanvas";
import MockupControls from "./components/MockupControls";
import { useImageTransform } from "./hooks/useImageTransform";

function App() {
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [selectedBase, setSelectedBase] = useState<"black" | "white">("black");
  const [isMockupGenerated, setIsMockupGenerated] = useState(false);
  const { transform, setTransform, resetTransform } = useImageTransform();

  const baseImages = {
    black: "/images/base-black.png",
    white: "/images/base-white.png",
  };

  const handleImageUpload = (imageUrl: string) => {
    setDesignImage(imageUrl);
    setIsMockupGenerated(false);
    resetTransform();
  };

  const handleGenerateMockup = () => {
    if (designImage) {
      // Set initial transform with optimal position and scale for shirt chest area
      // For typical model photos, the chest area is slightly above center
      // and horizontally centered on the shirt (not the full canvas)
      setTransform({
        x: 0, // Horizontally centered on canvas (which aligns with shirt center)
        y: 58, // Positioned at chest area (lower than before to hit the shirt center)
        scale: 0.25, // Slightly smaller for more realistic shirt design size
        rotation: 0,
      });
      setIsMockupGenerated(true);
    }
  };

  const handleResetMockup = () => {
    setIsMockupGenerated(false);
    resetTransform();
  };

  const handleDownload = () => {
    // Create a temporary canvas to export
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Load and draw base image
    const baseImg = new Image();
    baseImg.src = baseImages[selectedBase];
    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Load and draw design image if available
      if (designImage) {
        const designImg = new Image();
        designImg.src = designImage;
        designImg.onload = () => {
          ctx.save();
          ctx.translate(
            transform.x + canvas.width / 2,
            transform.y + canvas.height / 2
          );
          ctx.rotate((transform.rotation * Math.PI) / 180);
          ctx.scale(transform.scale, transform.scale);
          ctx.drawImage(
            designImg,
            -designImg.width / 2,
            -designImg.height / 2,
            designImg.width,
            designImg.height
          );
          ctx.restore();

          // Download the image
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `mockup-${selectedBase}-${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(url);
            }
          });
        };
      }
    };
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>👕 Clothes Mockup Generator - Long Tuyết</h1>
        <p>Tạo mockup áo thun đơn giản và nhanh chóng</p>
      </header>

      <div className="app-container">
        <div className="left-panel">
          <div className="upload-section">
            <h2>📤 Upload Design</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
            {designImage && (
              <div className="preview">
                <img src={designImage} alt="Design preview" />
              </div>
            )}
          </div>

          <div className="base-selector">
            <h2>🎨 Chọn màu áo</h2>
            <div className="base-options">
              <button
                className={`base-option ${
                  selectedBase === "black" ? "active" : ""
                }`}
                onClick={() => setSelectedBase("black")}
              >
                <img src={baseImages.black} alt="Black shirt" />
                <span>Đen</span>
              </button>
              <button
                className={`base-option ${
                  selectedBase === "white" ? "active" : ""
                }`}
                onClick={() => setSelectedBase("white")}
              >
                <img src={baseImages.white} alt="White shirt" />
                <span>Trắng</span>
              </button>
            </div>
          </div>

          {designImage && !isMockupGenerated && (
            <div className="generate-section">
              <button
                className="generate-button"
                onClick={handleGenerateMockup}
              >
                ✨ Generate Mockup
              </button>
            </div>
          )}
        </div>

        <div className="center-panel">
          <h2>🖼️ Mockup Preview</h2>
          <MockupCanvas
            baseImage={baseImages[selectedBase]}
            designImage={isMockupGenerated ? designImage : null}
            transform={transform}
            onTransformChange={setTransform}
          />
        </div>

        <div className="right-panel">
          {isMockupGenerated && designImage && (
            <MockupControls
              transform={transform}
              onTransformChange={setTransform}
              onReset={resetTransform}
              onDownload={handleDownload}
              onRegenerate={handleResetMockup}
            />
          )}
          {!designImage && (
            <div className="no-design-message">
              <p>👆 Upload một design để bắt đầu</p>
            </div>
          )}
          {designImage && !isMockupGenerated && (
            <div className="no-design-message">
              <p>👈 Chọn màu áo và nhấn Generate Mockup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
