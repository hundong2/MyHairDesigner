import React, { useState, useRef } from 'react';
import { TRENDING_HAIRSTYLES } from './constants';
import { HairstyleCard } from './components/HairstyleCard';
import { ResultView } from './components/ResultView';
import { SalonFinder } from './components/SalonFinder';
import { generateHairstyleImage, generateStyleAnalysis, analyzeUserFace } from './services/geminiService';
import { StylingResult, AnalysisResult } from './types';

function App() {
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<StylingResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stylesSectionRef = useRef<HTMLDivElement>(null);

  const selectedStyle = TRENDING_HAIRSTYLES.find(s => s.id === selectedStyleId);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setUserImage(base64Data);
        
        // Auto-trigger analysis when image is uploaded
        await runFaceAnalysis(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const runFaceAnalysis = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeUserFace(imageData);
      setAnalysisResult(analysis);
      
      // If we have recommended styles, auto-select the first one if none selected
      if (analysis.recommendedStyleIds.length > 0 && !selectedStyleId) {
        setSelectedStyleId(analysis.recommendedStyleIds[0]);
      }
      
      // Scroll to styles
      setTimeout(() => {
        stylesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);

    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedStyle) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // 1. Generate/Edit Image
      const imageUrl = await generateHairstyleImage(selectedStyle.name, userImage || undefined);
      
      // 2. Generate Text Analysis
      const analysis = await generateStyleAnalysis(selectedStyle.name, !!userImage);

      setResult({
        imageUrl,
        advice: analysis.advice,
        pros: analysis.pros,
        cons: analysis.cons
      });

    } catch (error) {
      alert("Something went wrong with the AI generation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedStyleId(null);
    setUserImage(null);
    setResult(null);
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-lg"></div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-violet-600">
                    Own my hair Designer
                </h1>
            </div>
            {(result || userImage) && (
                <button 
                    onClick={handleReset}
                    className="text-sm font-medium text-slate-500 hover:text-pink-600 transition-colors"
                >
                    Start Over
                </button>
            )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        
        {/* Step 0: Consultation / Upload (Moved to top for "Designer" feel) */}
        {!result && !isProcessing && (
          <div className="mb-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
            <div className="relative z-10 md:w-2/3">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Let AI Design Your Perfect Look</h2>
               <p className="text-slate-300 text-lg mb-8">
                 {userImage 
                   ? "Photo uploaded! We're analyzing your face shape to find the perfect match..." 
                   : "Upload a selfie. Our AI will analyze your face shape and recommend styles that suit you best."}
               </p>
               
               {!userImage && (
                  <div className="relative inline-block group">
                    <button className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                       Upload Your Selfie
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
               )}

               {isAnalyzing && (
                 <div className="mt-6 flex items-center gap-3 text-pink-300 animate-pulse">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Analyzing face shape & features...</span>
                 </div>
               )}

               {analysisResult && (
                 <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-pink-300 font-bold uppercase tracking-wider text-sm">
                      ✨ Analysis Complete
                    </div>
                    <div className="text-xl font-bold mb-2">
                      You have a <span className="text-pink-400">{analysisResult.faceShape}</span> face shape.
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {analysisResult.reasoning}
                    </p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Step 1: Style Selection */}
        {!result && !isProcessing && (
            <div ref={stylesSectionRef}>
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {analysisResult ? "Recommended For You" : "Trending Styles"}
                        </h2>
                        <p className="text-slate-600">
                          {analysisResult ? "We've highlighted styles that match your face shape." : "Choose a style to try on."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TRENDING_HAIRSTYLES.map((style) => (
                    <HairstyleCard 
                        key={style.id} 
                        styleData={style} 
                        isSelected={selectedStyleId === style.id}
                        isRecommended={analysisResult?.recommendedStyleIds.includes(style.id)}
                        onSelect={setSelectedStyleId}
                    />
                ))}
                </div>
            </div>
        )}

        {/* Step 2: Generate Action */}
        {selectedStyleId && !result && !isProcessing && (
           <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-slide-up">
              <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                  <div className="hidden md:block">
                      <p className="text-sm text-slate-500">Selected Style</p>
                      <p className="font-bold text-slate-800">{selectedStyle?.name}</p>
                  </div>
                  <button 
                      onClick={handleGenerate}
                      className="flex-1 md:flex-none md:w-64 py-4 bg-slate-900 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-slate-800 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
                  >
                      <span>Generate Look</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </button>
              </div>
           </div>
        )}

        {/* Step 3: Results */}
        {(result || isProcessing) && (
            <div className="animate-fade-in">
                <ResultView result={result!} isLoading={isProcessing} />
                
                {result && selectedStyle && (
                    <SalonFinder styleName={selectedStyle.name} />
                )}
            </div>
        )}

      </main>
    </div>
  );
}

export default App;