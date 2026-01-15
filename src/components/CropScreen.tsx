import { useState } from 'react';
import { Upload, Check } from 'lucide-react';

interface CropScreenProps {
  image: string;
  onReupload: () => void;
  onDone: (croppedImage: string) => void;
}

export function CropScreen({ image, onReupload, onDone }: CropScreenProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDone = () => {
    // In a real app, this would crop the image
    onDone(image);
  };

  // Handle touch/mouse interactions for pan and zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(zoom + delta, 1), 3);
    setZoom(newZoom);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-sm py-4 px-6 z-10">
        <h3 className="text-white font-semibold text-center text-lg">
          Crop Your Image
        </h3>
      </div>

      {/* Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        {/* Image with Square Grid Overlay */}
        <div className="relative w-full aspect-square max-w-sm">
          {/* Darkened Image Background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img 
              src={image} 
              alt="Crop"
              className="w-full h-full object-cover opacity-40"
              style={{ 
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>

          {/* Square Crop Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Dark overlay with square cutout */}
              <svg className="w-80 h-80" viewBox="0 0 320 320">
                <defs>
                  <mask id="squareMask">
                    <rect width="320" height="320" fill="white" />
                    <rect x="10" y="10" width="300" height="300" fill="black" />
                  </mask>
                </defs>
                <rect width="320" height="320" fill="rgba(0,0,0,0.6)" mask="url(#squareMask)" />
              </svg>

              {/* Visible square crop area with grid */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] overflow-hidden border border-white/40"
                onWheel={handleWheel}
              >
                <img 
                  src={image} 
                  alt="Cropped preview"
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
                
                {/* Grid Overlay - 3x3 grid */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Vertical lines */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30"></div>
                  {/* Horizontal lines */}
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30"></div>
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30"></div>
                </div>
              </div>

              {/* Corner brackets for visual guide */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none">
                {/* Top-left */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-white/60"></div>
                {/* Top-right */}
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-white/60"></div>
                {/* Bottom-left */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-white/60"></div>
                {/* Bottom-right */}
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-white/60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction text */}
        <p className="text-white/70 text-sm mt-6 text-center">
          Pinch to zoom • Drag to reposition
        </p>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-0 right-0 px-6 flex gap-4">
        <button
          onClick={onReupload}
          className="flex-1 bg-white/20 backdrop-blur-md text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2"
        >
          <Upload size={20} />
          Reupload
        </button>
        <button
          onClick={handleDone}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Done
        </button>
      </div>
    </div>
  );
}