import { Edit, ArrowRight } from 'lucide-react';

interface PreviewScreenProps {
  croppedImage: string;
  userName: string;
  template: string;
  onEdit: () => void;
  onContinue: () => void;
}

const templates = {
  sunrise: 'https://images.unsplash.com/photo-1640655236999-4cd6dfa12d89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwZ29sZGVuJTIwc2t5fGVufDF8fHx8MTc2ODQ4MzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  diwali: 'https://images.unsplash.com/photo-1761097332824-a80511520bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsYW1wcyUyMGxpZ2h0c3xlbnwxfHx8fDE3Njg0ODM1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  christmas: 'https://images.unsplash.com/photo-1732937135332-19276893ac6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RtYXMlMjB0cmVlJTIwbGlnaHRzJTIwZGVjb3JhdGlvbnN8ZW58MXx8fHwxNzY4NDgzNTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  birthday: 'https://images.unsplash.com/photo-1598622443054-499119043e82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGJhbGxvb25zJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY4NDc4OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080'
};

export function PreviewScreen({ croppedImage, userName, template, onEdit, onContinue }: PreviewScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col px-6 py-8">
      {/* Header */}
      <h2 className="text-xl font-semibold text-center mb-6 mt-4 text-white">
        Preview Your Design
      </h2>

      {/* Preview Card */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4' }}>
          {/* Background Template */}
          <img 
            src={templates[template as keyof typeof templates] || templates.sunrise}
            alt="Template background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay gradient for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

          {/* Good Morning Text - Top Center */}
          {/* <div className="absolute top-16 left-0 right-0 text-center px-6">
            <h2 
              className="text-3xl font-bold text-white mb-3"
              style={{
                textShadow: '2px 2px 12px rgba(0,0,0,0.4), 0 0 30px rgba(0,0,0,0.2)'
              }}
            >
              Good Morning
            </h2>
            <p 
              className="text-base text-white/95 leading-relaxed max-w-xs mx-auto"
              style={{
                textShadow: '1px 1px 8px rgba(0,0,0,0.5), 0 0 15px rgba(0,0,0,0.3)'
              }}
            >
              "Every morning brings new potential, but only if you make the most of it."
            </p>
          </div> */}

          {/* User's Circular Photo - Positioned lower at bottom */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-2 border-white/60 shadow-2xl">
            <img 
              src={croppedImage}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Name */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <h3 
              className="text-2xl font-bold text-white px-6"
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
              }}
            >
              {userName}
            </h3>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-center text-gray-400 mb-6">
        Your personalized image is ready! You can edit or continue to explore more templates.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 bg-gray-800 border-2 border-gray-700 text-gray-200 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <Edit size={20} />
          Edit
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}