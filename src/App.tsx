
import React, { useState, useRef, useCallback } from 'react';
import { SlidePreview } from './components/SlidePreview';
import { ControlPanel } from './components/ControlPanel';
import { SeoContentDisplay } from './components/SeoContentDisplay';
import type { Quote, SeoContent, Customization, SlideData } from './types';
import { InfoIcon, YoutubeIcon } from './components/Icons';

const App: React.FC = () => {
  const [slideData, setSlideData] = useState<SlideData>({
    quote: 'Click "Generate Quote" to start your creation.',
    author: 'AI Assistant',
    backgroundImage: `https://picsum.photos/seed/${Date.now()}/1280/720`,
    imagePrompt: 'A beautiful abstract background'
  });
  
  const [seoContent, setSeoContent] = useState<SeoContent | null>(null);
  
  const [customization, setCustomization] = useState<Customization>({
    textColor: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'Inter',
    textAlign: 'center',
    textShadow: true,
  });

  const [isLoading, setIsLoading] = useState({
    quote: false,
    image: false,
    seo: false,
  });
  
  const [error, setError] = useState<string | null>(null);

  const slidePreviewRef = useRef<HTMLDivElement>(null);

  const handleUpdateLoading = (key: keyof typeof isLoading, value: boolean) => {
    setIsLoading(prev => ({...prev, [key]: value}));
    if (value) setError(null);
  }
  
  const handleUpdateSlideData = (data: Partial<SlideData>) => {
    setSlideData(prev => ({...prev, ...data}));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <YoutubeIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight">
              Social Quote Slide Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="sticky top-24">
             <SlidePreview 
                ref={slidePreviewRef}
                slideData={slideData}
                customization={customization} 
                isLoadingImage={isLoading.image} 
              />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <ControlPanel
            onUpdateSlideData={handleUpdateSlideData}
            onUpdateCustomization={setCustomization}
            onUpdateLoading={handleUpdateLoading}
            onSetError={setError}
            onSetSeoContent={setSeoContent}
            slideData={slideData}
            customization={customization}
            isLoading={isLoading}
            slidePreviewRef={slidePreviewRef}
          />
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
              <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold">An Error Occurred</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <SeoContentDisplay seoContent={seoContent} isLoading={isLoading.seo} />
        </div>
      </main>
    </div>
  );
};

export default App;