import { useState } from 'react';
import { Upload, Sparkles, Image } from 'lucide-react';

interface UploadScreenProps {
  onUpload: (image: string, name: string) => void;
}

export function UploadScreen({ onUpload }: UploadScreenProps) {
  const [name, setName] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const originalImage = event.target?.result as string;
        setPreview(originalImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (preview && name) {
      onUpload(preview, name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative bg-[rgba(0,0,0,0)] px-6 pt-12 pb-16 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-8 right-8 animate-bounce">
          <Sparkles className="text-blue-400 opacity-60" size={24} />
        </div>
        <div className="absolute bottom-8 left-8 animate-pulse">
          <Image className="text-purple-400 opacity-40" size={28} />
        </div>

        {/* Header Content */}
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="text-blue-400" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Create Your Personalized Image
          </h1>
          <p className="text-gray-300 text-base max-w-xs mx-auto">
            Upload your photo and add your name to create stunning festive greetings
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-6">
        {/* Upload Area */}
        <div className="flex-1 flex flex-col justify-center -mt-8">
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="flex justify-center relative">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-w-full max-h-48 rounded-xl object-cover"
                />
              </div>
            ) : (
              <div className="border-4 border-dashed border-gray-700 rounded-3xl p-12 hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Upload className="w-10 h-10 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-gray-200 font-medium">Tap to upload photo</p>
                  <p className="text-gray-500 text-sm mt-2">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}
          </label>

          {/* Name Input */}
          <div className="mt-6">
            <label className="block text-gray-300 font-medium mb-2 text-sm">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-4 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors text-lg bg-gray-800 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={!preview || !name}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all active:scale-98 mt-6"
        >
          Generate Preview
        </button>
      </div>
    </div>
  );
}