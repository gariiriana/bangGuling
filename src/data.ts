import { Product } from './types';
import paruRumputLaut from './assets/paru_rumput_laut.png';
import paruOriginal from './assets/paru_original.png';
import nasiParu from './assets/nasi_paru.png';

export const products: Product[] = [
  {
    id: '1',
    name: 'Paru Nyam Nyam - Paru Crispy Rumput Laut',
    description: 'Nikmati kelezatan paru krispi premium dengan taburan rumput laut gurih. Tekstur renyah di luar, bumbu meresap di dalam. Camilan sehat dan praktis untuk menemani harimu!',
    price: 17500,
    image: paruRumputLaut,
    category: 'Snack',
    rating: 4.9,
    reviews: 1240,
    servings: '90 gram'
  },
  {
    id: '2',
    name: 'Paru Nyam Nyam - Paru Crispy Original',
    description: 'Varian klasik Paru Nyam Nyam dengan bumbu rempah pilihan yang gurih dan otentik. Digoreng hingga krispi sempurna tanpa pengawet. Rasa gurihnya bikin nggak bisa berhenti ngemil!',
    price: 15000,
    image: paruOriginal,
    category: 'Snack',
    rating: 4.8,
    reviews: 856,
    servings: '90 gram'
  },
  {
    id: '3',
    name: 'Nasi Paru Premium (Lengkap)',
    description: 'Porsi lengkap nasi putih hangat dengan taburan Paru Nyam Nyam krispi yang melimpah. Disertai sambal korek pedas, serundeng gurih, dan irisan mentimun segar. Menu makan siang paling mantap!',
    price: 20000,
    image: nasiParu,
    category: 'Makanan Utama',
    rating: 4.9,
    reviews: 2150,
    servings: '1 porsi lengkap'
  }
];
