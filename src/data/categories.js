import catSedan from '../assets/cars/cat-sedan.jpg';
import catSuv from '../assets/cars/cat-suv.jpg';
import catCoupe from '../assets/cars/cat-coupe.jpg';
import catSports from '../assets/cars/cat-sports.jpg';
import catLuxury from '../assets/cars/cat-luxury.jpg';
import catEv from '../assets/cars/cat-ev.jpg';
import catHybrid from '../assets/cars/cat-hybrid.jpg';

/**
 * The 7 showroom categories. `image` is the campaign studio shot for the
 * category; counts are derived from cars.js at the data barrel layer.
 */
export const CATEGORIES = [
  {
    id: 'suv',
    label: 'SUV',
    tagline: 'Command every road, paved or not.',
    image: catSuv,
  },
  {
    id: 'sedan',
    label: 'Sedan',
    tagline: 'Executive comfort with a driver\'s edge.',
    image: catSedan,
  },
  {
    id: 'coupe',
    label: 'Coupe',
    tagline: 'Two extra doors are a compromise.',
    image: catCoupe,
  },
  {
    id: 'sports',
    label: 'Sports',
    tagline: 'Heart rate, verified on track.',
    image: catSports,
  },
  {
    id: 'luxury',
    label: 'Luxury',
    tagline: 'First-class cabins, valet-approved.',
    image: catLuxury,
  },
  {
    id: 'electric',
    label: 'Electric',
    tagline: 'Silent torque, zero petrol stations.',
    image: catEv,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    tagline: 'Petrol range, EV manners.',
    image: catHybrid,
  },
];

export const CATEGORIES_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
