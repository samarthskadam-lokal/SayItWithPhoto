import { Download, Share2, ArrowLeft, Heart, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

interface FinalPreviewScreenProps {
  croppedImage: string;
  userName: string;
  template: string;
  onBack: () => void;
  onStartOver: () => void;
}

const templates = {
  sunrise: {
    name: 'Golden Morning',
    bg: 'https://images.unsplash.com/photo-1640655236999-4cd6dfa12d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwZ29sZGVuJTIwc2t5fGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Good Morning'
  },
  diwali: {
    name: 'Diwali Lights',
    bg: 'https://images.unsplash.com/photo-1761097332824-a80511520bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsYW1wcyUyMGxpZ2h0c3xlbnwxfHx8fDE3Njg0ODM1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Happy Diwali'
  },
  christmas: {
    name: 'Christmas Joy',
    bg: 'https://images.unsplash.com/photo-1732937135332-19276893ac6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwbGlnaHRzJTIwZGVjb3JhdGlvbnN8ZW58MXx8fHwxNzY4NDgzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Merry Christmas'
  },
  birthday: {
    name: 'Birthday Celebration',
    bg: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDc4OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Happy Birthday'
  },
  fireworks: {
    name: 'Celebration Night',
    bg: 'https://images.unsplash.com/photo-1736188551038-af1eebdb9dca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZlJTIwZmlyZXdvcmtzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDgzNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'Celebrate!'
  }
};

export function FinalPreviewScreen({ croppedImage, userName, template, onBack, onStartOver }: FinalPreviewScreenProps) {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTemplate = templates[template as keyof typeof templates] || templates.sunrise;

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  };

  // Function to create composite image
  const createCompositeImage = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas size (9:16 aspect ratio for mobile)
      canvas.width = 1080;
      canvas.height = 1920;

      // Load background image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.onload = () => {
        // Draw background
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        // Draw overlay gradient
        const gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient1.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        gradient1.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw user image in circle
        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';
        userImg.onload = () => {
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const radius = 280;

          // Draw decorative ring
          ctx.save();
          const ringGradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 15);
          ringGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          ringGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
          ctx.fillStyle = ringGradient;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Draw white border circle
          ctx.save();
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Clip and draw user image
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(userImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();

          // Draw greeting message at top
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.filter = 'blur(20px)';
          const messageWidth = ctx.measureText(currentTemplate.message).width + 120;
          const messageX = (canvas.width - messageWidth) / 2;
          const messageY = 320;
          drawRoundedRect(ctx, messageX, messageY, messageWidth, 80, 40);
          ctx.fill();
          ctx.filter = 'none';
          ctx.restore();

          ctx.save();
          ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(currentTemplate.message, canvas.width / 2, messageY + 40);
          ctx.restore();

          // Draw user name at bottom
          ctx.save();
          ctx.font = 'bold 120px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 24;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
          ctx.fillText(userName, canvas.width / 2, canvas.height - 380);
          ctx.restore();

          // Draw template name
          ctx.save();
          ctx.font = '32px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          // Draw decorative lines
          const lineY = canvas.height - 250;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 200, lineY);
          ctx.lineTo(canvas.width / 2 - 50, lineY);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 + 50, lineY);
          ctx.lineTo(canvas.width / 2 + 200, lineY);
          ctx.stroke();
          
          ctx.fillText(currentTemplate.name, canvas.width / 2, lineY);
          ctx.restore();

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          }, 'image/png');
        };
        userImg.onerror = () => reject(new Error('Failed to load user image'));
        userImg.src = croppedImage;
      };
      bgImg.onerror = () => reject(new Error('Failed to load background image'));
      bgImg.src = currentTemplate.bg;
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      console.log('Starting download...');
      const blob = await createCompositeImage();
      console.log('Blob created:', blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}-${currentTemplate.name.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('Download complete');
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      console.log('Starting share...');
      const blob = await createCompositeImage();
      console.log('Blob created:', blob);
      const file = new File([blob], `${userName}-${currentTemplate.name.replace(/\s+/g, '-')}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        console.log('Using Web Share API');
        await navigator.share({
          files: [file],
          title: `${currentTemplate.message} ${userName}!`,
          text: `Check out this festive greeting!`
        });
      } else {
        console.log('Web Share not available, falling back to download');
        // Fallback: just download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userName}-${currentTemplate.name.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      console.log('Share complete');
    } catch (error) {
      console.error('Share failed:', error);
      alert(`Share failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent py-4 px-6 z-10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          <Heart className="text-white" size={20} />
        </button>
      </div>

      {/* Full Preview Content */}
      <div className="flex-1 flex flex-col">
        {/* Main Preview Image */}
        <div className="flex-1 relative">
          {/* Background Template */}
          <img 
            src={currentTemplate.bg}
            alt="Template background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>

          {/* User's Circular Photo - Larger with decorative border */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Decorative ring */}
            <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-white/40 to-white/20 blur-sm"></div>
            
            <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src={croppedImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Greeting Message */}
          <div className="absolute top-24 left-0 right-0 text-center">
            <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              <p 
                className="text-white font-semibold text-xl"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {currentTemplate.message}
              </p>
            </div>
          </div>

          {/* User Name - Elegant Typography */}
          <div className="absolute bottom-32 left-0 right-0 text-center px-8">
            <h1 
              className="text-5xl font-bold text-white mb-2"
              style={{
                textShadow: '3px 3px 12px rgba(0,0,0,0.6), 0 0 30px rgba(0,0,0,0.4)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.02em'
              }}
            >
              {userName}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-12 bg-white/50"></div>
              <p 
                className="text-white/90 text-sm font-medium"
                style={{
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                }}
              >
                {currentTemplate.name}
              </p>
              <div className="h-px w-12 bg-white/50"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-900 px-6 py-6 flex gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download size={20} />
                Download
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {sharing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sharing...
              </>
            ) : (
              <>
                <Share2 size={20} />
                Share
              </>
            )}
          </button>
        </div>

        {/* New Image Button */}
        <div className="bg-gray-900 px-6 pb-4 pt-0">
          <button
            onClick={onStartOver}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-all flex items-center justify-center gap-2 border border-gray-700"
          >
            <Upload size={20} />
            Upload Different Image
          </button>
        </div>

        {/* Tips */}
        <div className="bg-gray-900 px-6 pb-6 pt-0">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <p className="text-blue-100 text-sm">
              Tap the back button to try different templates or edit your photo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
