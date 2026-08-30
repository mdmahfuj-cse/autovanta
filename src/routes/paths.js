/** Single source of truth for route paths. No magic strings elsewhere. */
export const PATHS = {
  home: '/',
  cars: '/cars',
  carDetails: (slug) => `/cars/${slug}`,
  brands: '/brands',
  brandDetails: (slug) => `/brands/${slug}`,
  compare: '/compare',
  wishlist: '/wishlist',
  services: '/services',
  serviceDetails: (slug) => `/services/${slug}`,
  finance: '/finance',
  testDrive: '/test-drive',
  journal: '/journal',
  article: (slug) => `/journal/${slug}`,
  about: '/about',
  contact: '/contact',
};
