// Jersey image imports - use these in components
import barcelonaHome from '@/assets/jerseys/barcelona-home.jpg';
import realMadridHome from '@/assets/jerseys/real-madrid-home.jpg';
import manUtdAway from '@/assets/jerseys/man-utd-away.jpg';
import brazilRetro from '@/assets/jerseys/brazil-retro-1970.jpg';
import liverpoolHome from '@/assets/jerseys/liverpool-home.jpg';
import barcelonaAway from '@/assets/jerseys/barcelona-away.jpg';
import argentinaWc from '@/assets/jerseys/argentina-wc.jpg';
import realMadridRetro from '@/assets/jerseys/real-madrid-retro-2002.jpg';
import travelTraining from '@/assets/jerseys/travel-training.jpg';
import psgHome from '@/assets/jerseys/psg-home.jpg';
import bayernFullSleeve from '@/assets/jerseys/bayern-full-sleeve.jpg';
import chelseaHome from '@/assets/jerseys/chelsea-home.jpg';

// Map product IDs to local images
export const jerseyImages: Record<string, string> = {
  '1': barcelonaHome,
  '2': realMadridHome,
  '3': manUtdAway,
  '4': brazilRetro,
  '5': liverpoolHome,
  '6': barcelonaAway,
  '7': argentinaWc,
  '8': realMadridRetro,
  '9': travelTraining,
  '10': psgHome,
  '11': bayernFullSleeve,
  '12': chelseaHome,
};

export const getJerseyImage = (productId: string, fallbackUrl?: string): string => {
  return jerseyImages[productId] || fallbackUrl || '';
};

export default jerseyImages;
