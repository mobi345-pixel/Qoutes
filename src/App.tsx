import React, { useState, useRef, useCallback } from 'react';
import { SlidePreview } from './components/SlidePreview';
import { ControlPanel } from './components/ControlPanel';
import { SeoContentDisplay } from './components/SeoContentDisplay';
import { InfoIcon, YoutubeIcon } from './components/Icons';
import type { SlideData, Customization, SeoContent } from './types';

// A good default background image to start with
const initialBackgroundImage = "data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231f2937' /%3E%3Cstop offset='100%25' stop-color='%23111827' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23g)' /%3E%3C/svg%3E";

const App: React.FC = () => {
  const [slideData, setSlideData] = useState<SlideData>({
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    backgroundImage: initialBackgroundImage,
    imagePrompt: "A serene and inspiring abstract background",
  });

  const [customization, setCustomization] = useState<Customization>({
    textColor: '#FFFFFF',
    fontSize: 64,
    fontFamily: 'Inter',
    textAlign: 'center',
    textShadow: true,
  });

  const [isLoading, setIsLoading] = useState({
    quote: false,
    image: false,
    seo: false,
  });
  
  const [seoContent, setSeoContent] = useState<SeoContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slidePreviewRef = useRef<HTMLDivElement>(null);

  const handleUpdateSlideData = (data: Partial<SlideData>) => {
    setSlideData(prev => ({ ...prev, ...data }));
  };

  const handleUpdateLoading = useCallback((key: 'quote' | 'image' | 'seo', value: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleSetError = (message: string | null) => {
    setError(message);
    if (message) {
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
             <div className="bg-indigo-600 p-2 rounded-lg">
                <YoutubeIcon className="w-8 h-8 text-white"/>
             </div>
             <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Social Quote Slide Generator
                </h1>
                <p className="text-gray-400 mt-1">AI-powered content for faceless channels</p>
             </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3 shadow-lg" role="alert">
            <InfoIcon className="w-6 h-6"/>
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <span className="text-2xl">×</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SlidePreview 
              ref={slidePreviewRef}
              slideData={slideData}
              customization={customization}
              isLoadingImage={isLoading.image}
            />
          </div>
          <aside>
            <ControlPanel
              onUpdateSlideData={handleUpdateSlideData}
              onUpdateCustomization={setCustomization}
              onUpdateLoading={handleUpdateLoading}
              onSetError={handleSetError}
              onSetSeoContent={setSeoContent}
              slideData={slideData}
              customization={customization}
              isLoading={isLoading}
              slidePreviewRef={slidePreviewRef}
            />
          </aside>
        </div>

        <div className="mt-8">
            <SeoContentDisplay seoContent={seoContent} isLoading={isLoading.seo} />
        </div>
      </main>
      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>Powered by Google Gemini. Built for content creators.</p>
      </footer>
    </div>
  );
};

export default App;
