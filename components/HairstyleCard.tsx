import React from 'react';
import { Hairstyle } from '../types';

interface Props {
  styleData: Hairstyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const HairstyleCard: React.FC<Props> = ({ styleData, isSelected, onSelect }) => {
  const getBadgeColor = (tag?: string) => {
    switch(tag) {
      case 'New': return 'bg-blue-500';
      case 'Popular': return 'bg-rose-500';
      case 'Trending': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      onClick={() => onSelect(styleData.id)}
      className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border-2 ${
        isSelected ? 'border-pink-500 shadow-lg shadow-pink-200' : 'border-transparent shadow-md bg-white'
      }`}
    >
      <div className="relative h-48 w-full">
        <img 
          src={styleData.imageUrl} 
          alt={styleData.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Trend Badge */}
        {styleData.tag && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold text-white rounded-full shadow-sm ${getBadgeColor(styleData.tag)}`}>
            {styleData.tag}
          </div>
        )}

        {isSelected && (
          <div className="absolute inset-0 bg-pink-500 bg-opacity-20 flex items-center justify-center">
            <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800">{styleData.name}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{styleData.description}</p>
      </div>
    </div>
  );
};