import React from 'react';

interface Props {
  step: 1 | 2 | 3 | 4; // 1: Upload, 2: Select, 3: Generate, 4: Result
}

export const SmartGuide: React.FC<Props> = ({ step }) => {
  const steps = [
    { num: 1, label: 'Analysis', icon: '📸' },
    { num: 2, label: 'Selection', icon: '💇‍♀️' },
    { num: 3, label: 'Generation', icon: '✨' },
  ];

  const getTipContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Step 1: Let's analyze your features",
          text: "Upload a clear selfie to let our AI identify your face shape. Good lighting helps accuracy!",
          tip: "💡 Tip: Pull your hair back so we can see your jawline clearly."
        };
      case 2:
        return {
          title: "Step 2: Choose your style",
          text: "We've highlighted styles that match your face shape with a green border.",
          tip: "💡 Tip: 'Best Match' styles are mathematically proven to balance your features."
        };
      case 3:
        return {
          title: "Step 3: Create your new look",
          text: "You've selected a style! Click the 'Generate Look' button below to simulate it.",
          tip: "💡 Tip: The AI will preserve your facial expression while changing the hair."
        };
      default:
        return null;
    }
  };

  const content = getTipContent();
  if (!content) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-0 rounded-full"></div>
        {steps.map((s) => (
          <div key={s.num} className={`relative z-10 flex flex-col items-center gap-2 ${step >= s.num ? 'text-pink-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
              step >= s.num ? 'bg-pink-600 text-white shadow-lg shadow-pink-200 scale-110' : 'bg-white border-2 border-slate-200'
            }`}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Guide Content */}
      <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="p-2 bg-white rounded-lg shadow-sm text-2xl">
          {step === 1 ? '👋' : step === 2 ? '👆' : '🚀'}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-1">{content.title}</h4>
          <p className="text-slate-600 text-sm mb-2">{content.text}</p>
          <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">
            {content.tip}
          </div>
        </div>
      </div>
    </div>
  );
};