
import React from 'react';
import { toPng } from 'html-to-image';
import { generateQuote, generateBackgroundImage, generateSeoContent } from '../services/geminiService';
import type { Customization, SlideData, SeoContent } from '../types';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { DownloadIcon, ImageIcon, QuoteIcon, SparklesIcon } from './Icons';

interface ControlPanelProps {
  onUpdateSlideData: (data: Partial<SlideData>) => void;
  onUpdateCustomization: React.Dispatch<React.SetStateAction<Customization>>;
  onUpdateLoading: (key: 'quote' | 'image' | 'seo', value: boolean) => void;
  onSetError: (error: string | null) => void;
  onSetSeoContent: (content: SeoContent | null) => void;
  slideData: SlideData;
  customization: Customization;
  isLoading: { quote: boolean; image: boolean; seo: boolean };
  slidePreviewRef: React.RefObject<HTMLDivElement>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onUpdateSlideData,
  onUpdateCustomization,
  onUpdateLoading,
  onSetError,
  onSetSeoContent,
  slideData,
  customization,
  isLoading,
  slidePreviewRef,
}) => {
  const handleGenerateQuote = async () => {
    onUpdateLoading('quote', true);
    try {
      const newQuote = await generateQuote();
      onUpdateSlideData({ quote: newQuote.quote, author: newQuote.author });
    } catch (e: any) {
      onSetError(e.message);
    } finally {
      onUpdateLoading('quote', false);
    }
  };

  const handleGenerateImage = async () => {
    onUpdateLoading('image', true);
    try {
      const newImage = await generateBackgroundImage(slideData.imagePrompt);
      onUpdateSlideData({ backgroundImage: newImage });
    } catch (e: any) {
      onSetError(e.message);
    } finally {
      onUpdateLoading('image', false);
    }
  };

  const handleGenerateSeo = async () => {
    onUpdateLoading('seo', true);
    onSetSeoContent(null);
    try {
      const newSeoContent = await generateSeoContent(slideData.quote, slideData.author);
      onSetSeoContent(newSeoContent);
    } catch (e: any) {
      onSetError(e.message);
    } finally {
      onUpdateLoading('seo', false);
    }
  };

  const handleDownload = () => {
    if (slidePreviewRef.current === null) {
      return;
    }
    toPng(slidePreviewRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'quote-slide.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        onSetError('Could not download image. ' + err.message);
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title="1. Generate Content" icon={<QuoteIcon/>}>
        <button onClick={handleGenerateQuote} disabled={isLoading.quote} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
          {isLoading.quote ? <Spinner /> : <><QuoteIcon className="w-5 h-5 mr-2"/>Generate New Quote</>}
        </button>
      </Card>
      
      <Card title="2. Generate Background" icon={<ImageIcon/>}>
        <div className="flex flex-col gap-3">
          <label htmlFor="image-prompt" className="font-semibold text-gray-300">Image Prompt</label>
          <textarea
            id="image-prompt"
            value={slideData.imagePrompt}
            onChange={(e) => onUpdateSlideData({ imagePrompt: e.target.value })}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            rows={3}
          />
          <button onClick={handleGenerateImage} disabled={isLoading.image} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
            {isLoading.image ? <Spinner /> : <><ImageIcon className="w-5 h-5 mr-2"/>Generate New Image</>}
          </button>
        </div>
      </Card>

      <Card title="3. Customize" icon={<SparklesIcon/>}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="text-color" className="block text-sm font-medium text-gray-300 mb-1">Text Color</label>
            <input
              type="color"
              id="text-color"
              value={customization.textColor}
              onChange={(e) => onUpdateCustomization(c => ({...c, textColor: e.target.value}))}
              className="w-full h-10 p-1 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="font-size" className="block text-sm font-medium text-gray-300 mb-1">Font Size: {customization.fontSize}px</label>
            <input
              type="range"
              id="font-size"
              min="24"
              max="96"
              value={customization.fontSize}
              onChange={(e) => onUpdateCustomization(c => ({...c, fontSize: parseInt(e.target.value)}))}
              className="w-full h-10"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor="font-family" className="block text-sm font-medium text-gray-300 mb-1">Font Family</label>
            <select
              id="font-family"
              value={customization.fontFamily}
              onChange={(e) => onUpdateCustomization(c => ({...c, fontFamily: e.target.value}))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            >
              <option>Inter</option>
              <option>Georgia</option>
              <option>Verdana</option>
              <option>Times New Roman</option>
            </select>
          </div>
           <div className="col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Text Shadow</span>
              <button
                onClick={() => onUpdateCustomization(c => ({ ...c, textShadow: !c.textShadow }))}
                className={`${customization.textShadow ? 'bg-indigo-600' : 'bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className={`${customization.textShadow ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="4. Finalize" icon={<DownloadIcon/>}>
        <div className="flex flex-col gap-4">
           <button onClick={handleGenerateSeo} disabled={isLoading.seo} className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
            {isLoading.seo ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2"/>Generate SEO Content</>}
          </button>
          <button onClick={handleDownload} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
            <DownloadIcon className="w-5 h-5 mr-2"/>Download Slide
          </button>
        </div>
      </Card>
    </div>
  );
};