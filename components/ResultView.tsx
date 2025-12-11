import React, { useState, useEffect } from 'react';
import { StylingResult } from '../types';
import { ChatConsultant } from './ChatConsultant';
import { StyleCard } from './StyleCard';

interface Props {
  result: StylingResult;
  isLoading: boolean;
  originalImage: string | null;
  styleName: string;
  faceShape?: string;
}

export const ResultView: React.FC<Props> = ({ result, isLoading, originalImage, styleName, faceShape }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // Sync with prop when result changes (initial generation)
  useEffect(() => {
    if (result?.imageUrl) {
        setCurrentImageUrl(result.imageUrl);
    }
  }, [result]);

  const handleImageUpdate = (newUrl: string) => {
    setCurrentImageUrl(newUrl);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">Consulting AI Stylist & Generating Look...</p>
      </div>
    );
  }

  if (!currentImageUrl) return null;

  return (
    <div className="space-y-12">
      {/* Visual Result Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          {/* Image Section with Toggle */}
          <div className="md:w-1/2 bg-slate-100 relative min-h-[400px] group">
            <img 
              src={showOriginal && originalImage ? `data:image/jpeg;base64,${originalImage}` : currentImageUrl} 
              alt="Styled Result" 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {/* Before/After Toggle Button */}
            {originalImage && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                 <button
                   onMouseDown={() => setShowOriginal(true)}
                   onMouseUp={() => setShowOriginal(false)}
                   onMouseLeave={() => setShowOriginal(false)}
                   onTouchStart={() => setShowOriginal(true)}
                   onTouchEnd={() => setShowOriginal(false)}
                   className="bg-white/90 backdrop-blur text-slate-900 px-6 py-2 rounded-full shadow-lg font-bold text-sm tracking-wide hover:bg-white active:scale-95 transition-all select-none border border-slate-200"
                 >
                   Hold to Compare
                 </button>
              </div>
            )}
            
            {/* Label Badge */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
               {showOriginal ? 'Before' : 'After'}
            </div>
          </div>

          {/* Text Analysis Section */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">New Look: {styleName}</h2>
              <div className="h-1 w-20 bg-pink-500 rounded-full mb-6"></div>
              
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-wide text-pink-500 font-semibold mb-2">Stylist's Note</h3>
                <p className="text-slate-700 leading-relaxed text-lg italic">"{result.advice}"</p>
              </div>

              {/* Pros & Cons */}
              {(result.pros && result.pros.length > 0) && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                      <span>👍</span> Pros
                    </h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      {result.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                      <span>⚠️</span> Cons
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      {result.cons?.map((con, i) => <li key={i}>• {con}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Use the chat below to customize or adjust this look!</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Sharing & Style Card Section */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800">Share Your Transformation</h3>
            <p className="text-slate-500">Show off your new style to your friends or save it for later.</p>
        </div>
        <StyleCard 
            imageUrl={currentImageUrl} 
            styleName={styleName} 
            faceShape={faceShape} 
        />
      </div>

      {/* Chat Section */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
         <ChatConsultant 
            styleName={styleName} 
            faceShape={faceShape} 
            currentImage={currentImageUrl}
            onImageUpdate={handleImageUpdate}
         />
      </div>
    </div>
  );
};