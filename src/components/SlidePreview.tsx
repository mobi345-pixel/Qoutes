
import React, { forwardRef } from 'react';
import type { Customization, SlideData } from '../types';
import { Spinner } from './Spinner';

interface SlidePreviewProps {
  slideData: SlideData;
  customization: Customization;
  isLoadingImage: boolean;
}

export const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(({ slideData, customization, isLoadingImage }, ref) => {
  const { quote, author, backgroundImage } = slideData;
  const { textColor, fontSize, fontFamily, textAlign, textShadow } = customization;

  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily: `${fontFamily}, sans-serif`,
    textAlign: textAlign,
    textShadow: textShadow ? '2px 2px 4px rgba(0,0,0,0.7)' : 'none',
  };

  return (
    <div className="w-full aspect-video bg-gray-800 rounded-xl shadow-2xl overflow-hidden relative" ref={ref}>
      {isLoadingImage && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <Spinner />
          <p className="ml-4 text-lg">Generating new background...</p>
        </div>
      )}
      <img src={backgroundImage} alt="Generated background" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          <p style={textStyle} className="font-bold leading-tight drop-shadow-lg transition-all duration-300">
            “{quote}”
          </p>
          <p style={{...textStyle, fontSize: `${fontSize * 0.5}px`}} className="font-semibold mt-6 opacity-80 transition-all duration-300">
            - {author}
          </p>
        </div>
      </div>
    </div>
  );
});

SlidePreview.displayName = 'SlidePreview';