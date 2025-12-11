import React, { useState, useRef } from 'react';
import { TRENDING_HAIRSTYLES } from './constants';
import { HairstyleCard } from './components/HairstyleCard';
import { ResultView } from './components/ResultView';
import { SalonFinder } from './components/SalonFinder';
import { generateHairstyleImage, generateStyleAnalysis } from './services/geminiService';
import { StylingResult } from './types';

function App() {
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<StylingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedStyle = TRENDING_HAIRSTYLES.find(s => s.id === selectedStyleId);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API processing if needed, but Gemini usually handles standard base64 or requires raw bytes.
        // For inlineData, we need the base64 string without the prefix.
        const base64Data = base64String.split(',')[1];
        setUserImage(base64Data);
      };
      reader.readAsDataURL(file);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            {result && (
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
        
        {/* Step 1: Style Selection */}
        {!result && !isProcessing && (
            <>
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Choose Your New Look</h2>
                    <p className="text-slate-600 text-lg">Select from the latest trends and popular rankings.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TRENDING_HAIRSTYLES.map((style) => (
                    <HairstyleCard 
                    key={style.id} 
                    styleData={style} 
                    isSelected={selectedStyleId === style.id}
                    onSelect={setSelectedStyleId}
                    />
                ))}
                </div>
            </>
        )}

        {/* Step 2: Upload & Action Area */}
        {selectedStyleId && !result && !isProcessing && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center gap-8">
                
                {/* Upload Area */}
                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold mb-4">Upload Your Photo (Optional)</h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {userImage ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <span className="font-medium text-green-700">Photo Uploaded!</span>
                                <span className="text-xs text-slate-400 mt-1">Click to change</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-slate-600 font-medium">Click to upload your selfie</span>
                                <span className="text-xs text-slate-400 mt-2">Or skip to use an AI model</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 w-full space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-800 mb-1">
                            {userImage ? "✨ Custom Makeover" : "🤖 AI Model Mode"}
                        </h4>
                        <p className="text-sm text-slate-600">
                            {userImage 
                                ? `We will blend the ${selectedStyle?.name} onto your uploaded photo using advanced AI.` 
                                : `We will generate a hyper-realistic AI avatar wearing the ${selectedStyle?.name} so you can see the vibe.`}
                        </p>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        Generate Style
                    </button>
                </div>
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