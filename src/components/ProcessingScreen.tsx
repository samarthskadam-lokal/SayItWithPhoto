import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';

interface ProcessingScreenProps {
  image: string;
  onComplete: (processedImage: string) => void;
}

export function ProcessingScreen({ image, onComplete }: ProcessingScreenProps) {
  useEffect(() => {
    const processImage = async () => {
      try {
        // Remove background using @imgly/background-removal
        // Configure to avoid multi-threading warnings
        const blob = await removeBackground(image, {
          model: 'small',
          output: {
            format: 'image/png',
            quality: 0.8,
          }
        });
        
        // Convert blob to data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          const processedImage = reader.result as string;
          // Wait a bit to show the processing screen, then complete
          setTimeout(() => {
            onComplete(processedImage);
          }, 500);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Background removal error:', error);
        // If removal fails, just pass the original image
        setTimeout(() => {
          onComplete(image);
        }, 500);
      }
    };
    
    processImage();
  }, [image, onComplete]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">
      {/* Spinning Icon */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />
        </div>
        {/* Pulse Effect */}
        <div className="absolute inset-0 w-32 h-32 bg-blue-500 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-semibold text-white mb-3">
        Processing Image...
      </h3>
      <p className="text-gray-400 text-lg text-center mb-8">
        Removing background and<br />optimizing your photo
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"
            style={{ width: '100%' }}
          ></div>
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-400">
          <span>Processing...</span>
          <span className="font-medium">85%</span>
        </div>
      </div>

      {/* Status Steps */}
      <div className="mt-12 space-y-4 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-gray-300">Image uploaded</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
          <span className="text-white font-medium">Removing background</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0"></div>
          <span className="text-gray-500">Optimizing quality</span>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}