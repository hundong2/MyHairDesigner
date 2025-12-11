import React from 'react';
import { StylingResult } from '../types';

interface Props {
  result: StylingResult;
  isLoading: boolean;
}

export const ResultView: React.FC<Props> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
        <p className="text-slate-600 font-medium animate-pulse">Consulting AI Stylist & Generating Look...</p>
      </div>
    );
  }

  if (!result.imageUrl) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2 bg-slate-100 relative min-h-[300px]">
          <img 
            src={result.imageUrl} 
            alt="Styled Result" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Analysis Section */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Styling Report</h2>
          
          <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-pink-500 font-semibold mb-2">Advice</h3>
            <p className="text-slate-700 leading-relaxed italic">"{result.advice}"</p>
          </div>

          {/* Pros & Cons (Only if available - usually for No-Upload scenario) */}
          {(result.pros && result.pros.length > 0) && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-bold text-green-700 mb-2 flex items-center">
                  <span className="mr-2">👍</span> Pros
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  {result.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-bold text-red-700 mb-2 flex items-center">
                  <span className="mr-2">⚠️</span> Cons
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {result.cons?.map((con, i) => <li key={i}>• {con}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
