export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tag?: 'New' | 'Popular' | 'Trending';
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Salon {
  title: string;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
}

export interface StylingResult {
  imageUrl: string;
  advice: string;
  pros?: string[];
  cons?: string[];
}

export interface AnalysisResult {
  faceShape: string;
  hairTexture?: string;
  colorTone?: string;
  recommendedStyleIds: string[];
  reasoning: string;
}