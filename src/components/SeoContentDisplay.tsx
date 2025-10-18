
import React, { useState } from 'react';
import type { SeoContent } from '../types';
import { Card } from './Card';
import { Spinner } from './Spinner';
import { ClipboardCheckIcon, ClipboardIcon, HashtagIcon, TitleIcon } from './Icons';

interface SeoContentDisplayProps {
  seoContent: SeoContent | null;
  isLoading: boolean;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
      {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
    </button>
  );
};

export const SeoContentDisplay: React.FC<SeoContentDisplayProps> = ({ seoContent, isLoading }) => {
  if (isLoading) {
    return (
      <Card title="YouTube SEO Content" icon={<TitleIcon/>}>
        <div className="flex items-center justify-center h-48">
          <Spinner />
          <p className="ml-4">Generating SEO content...</p>
        </div>
      </Card>
    );
  }

  if (!seoContent) {
    return null;
  }

  return (
    <Card title="YouTube SEO Content" icon={<TitleIcon/>}>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-200">Title</h4>
            <CopyButton text={seoContent.title} />
          </div>
          <p className="bg-gray-800/50 p-3 rounded-md text-gray-300 text-sm">{seoContent.title}</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-200">Description</h4>
            <CopyButton text={seoContent.description} />
          </div>
          <p className="bg-gray-800/50 p-3 rounded-md text-gray-300 text-sm whitespace-pre-wrap">{seoContent.description}</p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-gray-200">Tags</h4>
            <CopyButton text={seoContent.tags.join(', ')} />
          </div>
          <div className="flex flex-wrap gap-2">
            {seoContent.tags.map((tag, index) => (
              <span key={index} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <HashtagIcon className="w-3 h-3"/> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};