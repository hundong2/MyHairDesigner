import React from 'react';

interface Props {
  imageUrl: string;
  styleName: string;
  faceShape?: string;
}

export const StyleCard: React.FC<Props> = ({ imageUrl, styleName, faceShape }) => {
  const handleShare = async () => {
    const shareData = {
      title: 'My Hair Designer Look',
      text: `Check out my new ${styleName} look created with My Hair Designer! #MyHairDesigner #AIStylist`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Visual Card Area - Designed to look like a shareable asset */}
      <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full aspect-[3/4] group">
        <img 
          src={imageUrl} 
          alt="Style Card" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

        {/* Top Branding */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-md"></div>
            <span className="text-white font-bold tracking-wide text-sm drop-shadow-md">My hair Designer</span>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="mb-2 inline-block px-3 py-1 border border-white/30 rounded-full text-xs font-medium backdrop-blur-md uppercase tracking-wider">
                {faceShape ? `${faceShape} Face Shape` : 'AI Styled'}
            </div>
            <h2 className="text-3xl font-bold mb-2 leading-tight drop-shadow-lg">{styleName}</h2>
            <div className="flex items-center gap-2 text-white/80 text-sm">
                <span>✨ 98% Match Score</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString()}</span>
            </div>
        </div>
      </div>

      {/* Share Actions */}
      <button 
        onClick={handleShare}
        className="mt-6 flex items-center gap-2 px-8 py-3 bg-pink-600 text-white rounded-full font-bold shadow-lg hover:bg-pink-700 hover:-translate-y-0.5 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
        Share My Look
      </button>
      <p className="mt-3 text-xs text-slate-400">Share with your friends or save for your stylist</p>
    </div>
  );
};