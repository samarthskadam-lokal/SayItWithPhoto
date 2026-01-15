import { useState } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { ProcessingScreen } from './components/ProcessingScreen';
import { CropScreen } from './components/CropScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { TemplateSelectionScreen } from './components/TemplateSelectionScreen';
import { FinalPreviewScreen } from './components/FinalPreviewScreen';

type Screen = 'upload' | 'processing' | 'crop' | 'preview' | 'templates' | 'final';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('upload');
  const [previousScreen, setPreviousScreen] = useState<Screen | null>(null);
  const [userName, setUserName] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('sunrise');

  const handleUpload = (image: string, name: string) => {
    setUploadedImage(image);
    setUserName(name);
    setCurrentScreen('processing');
  };

  const handleProcessingComplete = (image: string) => {
    setProcessedImage(image);
    setCurrentScreen('crop');
  };

  const handleCropDone = (image: string) => {
    setCroppedImage(image);
    setCurrentScreen('preview');
  };

  const handleContinue = () => {
    setCurrentScreen('templates');
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCurrentScreen('final');
  };

  const handleEditFromPreview = () => {
    setPreviousScreen('preview');
    setCurrentScreen('crop');
  };

  const handleEditFromTemplates = () => {
    setPreviousScreen('templates');
    setCurrentScreen('crop');
  };

  const handleCropCancel = () => {
    // If coming from preview or templates, go back there
    if (previousScreen === 'preview') {
      setCurrentScreen('preview');
      setPreviousScreen(null);
    } else if (previousScreen === 'templates') {
      setCurrentScreen('templates');
      setPreviousScreen(null);
    } else {
      // Otherwise, go back to upload (first time flow)
      setCurrentScreen('upload');
    }
  };

  const handleStartOver = () => {
    // Reset all state and go back to upload
    setUserName('');
    setUploadedImage('');
    setProcessedImage('');
    setCroppedImage('');
    setSelectedTemplate('sunrise');
    setPreviousScreen(null);
    setCurrentScreen('upload');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {currentScreen === 'upload' && (
        <UploadScreen onUpload={handleUpload} />
      )}
      {currentScreen === 'processing' && (
        <ProcessingScreen image={uploadedImage} onComplete={handleProcessingComplete} />
      )}
      {currentScreen === 'crop' && (
        <CropScreen 
          image={processedImage} 
          onReupload={handleStartOver}
          onDone={handleCropDone}
        />
      )}
      {currentScreen === 'preview' && (
        <PreviewScreen 
          croppedImage={croppedImage}
          userName={userName}
          template={selectedTemplate}
          onEdit={handleEditFromPreview}
          onContinue={handleContinue}
        />
      )}
      {currentScreen === 'templates' && (
        <TemplateSelectionScreen 
          croppedImage={croppedImage}
          userName={userName}
          onTemplateSelect={handleTemplateSelect}
          onEdit={handleEditFromTemplates}
        />
      )}
      {currentScreen === 'final' && (
        <FinalPreviewScreen 
          croppedImage={croppedImage}
          userName={userName}
          template={selectedTemplate}
          onBack={() => setCurrentScreen('templates')}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}