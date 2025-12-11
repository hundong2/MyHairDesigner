import { Hairstyle } from "./types";

export const TRENDING_HAIRSTYLES: Hairstyle[] = [
  // --- FEMALE STYLES ---
  {
    id: 'f-hime-cut',
    name: 'Hime Cut',
    description: 'A princess-style cut with cheek-length sidelocks and frontal fringe.',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    gender: 'female',
    tag: 'New' 
  },
  {
    id: 'f-wolf-cut',
    name: 'Wolf Cut',
    description: 'A trendy mix of a shag and a mullet with heavy layers.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    gender: 'female',
    tag: 'Popular'
  },
  {
    id: 'f-french-bob',
    name: 'French Bob',
    description: 'A chic, chin-length bob often paired with bangs.',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80',
    gender: 'female',
    tag: 'Trending'
  },
  {
    id: 'f-curtain-bangs',
    name: 'Long Layers & Curtain Bangs',
    description: 'Face-framing bangs with voluminous long layers.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    gender: 'female',
    tag: 'Popular'
  },
  {
    id: 'f-pixie-cut',
    name: 'Textured Pixie',
    description: 'Short, edgy, and low maintenance with plenty of texture.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    gender: 'female'
  },
  {
    id: 'f-balayage-waves',
    name: 'Balayage Beach Waves',
    description: 'Sun-kissed highlights on long, wavy hair.',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80',
    gender: 'female'
  },
  {
    id: 'f-blunt-bob',
    name: 'Blunt Bob',
    description: 'Sharp, straight-cut bob ending at the jawline.',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=500&q=80',
    gender: 'female'
  },
  {
    id: 'f-shag',
    name: 'Modern Shag',
    description: 'Choppy layers and texture for a rock-n-roll vibe.',
    imageUrl: 'https://images.unsplash.com/photo-1506956191951-7a88da4435e5?auto=format&fit=crop&w=500&q=80',
    gender: 'female'
  },
  {
    id: 'f-butterfly',
    name: 'Butterfly Cut',
    description: 'Heavily layered cut that mimics short hair in front.',
    imageUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=500&q=80',
    gender: 'female',
    tag: 'New'
  },
  {
    id: 'f-afro',
    name: 'Natural Afro',
    description: 'Voluminous, rounded natural texture.',
    imageUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=500&q=80',
    gender: 'female'
  },

  // --- MALE STYLES ---
  {
    id: 'm-undercut',
    name: 'Classic Undercut',
    description: 'Short sides with long top, styled back or to the side.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    gender: 'male',
    tag: 'Popular'
  },
  {
    id: 'm-pompadour',
    name: 'Modern Pompadour',
    description: 'Voluminous top swept upwards and back.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-crew-cut',
    name: 'Textured Crew Cut',
    description: 'Clean, short, and low-maintenance with a messy top.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    gender: 'male',
    tag: 'Trending'
  },
  {
    id: 'm-buzz-cut',
    name: 'Buzz Cut',
    description: 'Minimalist, military-inspired ultra-short cut.',
    imageUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-quiff',
    name: 'The Quiff',
    description: 'A hybrid of the pompadour and flattop, very versatile.',
    imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=500&q=80',
    gender: 'male',
    tag: 'New'
  },
  {
    id: 'm-mid-fade',
    name: 'Mid Fade + Crop',
    description: 'Faded sides with a textured, cropped top.',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-man-bun',
    name: 'Man Bun',
    description: 'Long hair tied back, paired with a beard or clean shave.',
    imageUrl: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-slick-back',
    name: 'Slicked Back',
    description: 'Formal, glossy look combed straight back.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-curtains',
    name: '90s Curtains',
    description: 'Middle part with long fringe, a classic revival.',
    imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=500&q=80',
    gender: 'male'
  },
  {
    id: 'm-mullet',
    name: 'Modern Mullet',
    description: 'Business in the front, party in the back.',
    imageUrl: 'https://images.unsplash.com/photo-1520975661595-dc998dd24d38?auto=format&fit=crop&w=500&q=80',
    gender: 'male',
    tag: 'New'
  }
];