import React, { useState, useEffect } from 'react';
import { Coordinates } from '../types';
import { searchNearbySalons } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  styleName: string;
}

export const SalonFinder: React.FC<Props> = ({ styleName }) => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [salonText, setSalonText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError("Location access denied. Cannot find nearby salons.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const result = await searchNearbySalons(styleName, location);
      setSalonText(result);
    } catch (e) {
      setError("Failed to fetch salon recommendations.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mt-8">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-12 border-t pt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Ready to get this look?</h2>
        <p className="text-slate-600">Find the best rated salons near you specializing in {styleName}.</p>
      </div>

      {!salonText && !loading && (
         <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={!location}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find Nearby Salons
            </button>
         </div>
      )}

      {loading && (
        <div className="text-center p-8">
           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-pink-500 mb-2"></div>
           <p className="text-slate-500">Searching Google Maps for top rated salons...</p>
        </div>
      )}

      {salonText && location && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Recommendation Text */}
          <div className="bg-white p-8 rounded-2xl shadow-lg prose prose-pink max-w-none h-fit">
            <h3 className="text-xl font-bold text-slate-800 not-prose mb-4 flex items-center gap-2">
              <span className="text-2xl">✂️</span> AI Recommendations
            </h3>
            <ReactMarkdown>{salonText}</ReactMarkdown>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white p-2 rounded-2xl shadow-lg h-[500px] overflow-hidden relative">
             <iframe
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '1rem' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(styleName + " hair salon")}&sll=${location.latitude},${location.longitude}&z=13&output=embed`}
            ></iframe>
            <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-xs font-semibold text-slate-600">
               Based on your location
            </div>
          </div>
        </div>
      )}
    </div>
  );
};