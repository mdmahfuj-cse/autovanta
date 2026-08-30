/** Central CTA targets for homepage sections (kept out of components). */
export const PATHS_EXPORTS = {
  featuredCars: '/cars?flag=featured',
  newArrivals: '/cars?flag=newArrival',
  performance: '/cars?flag=performance',
  category: (id) => `/cars?category=${id}`,
  brands: '/brands',
  compare: '/compare',
  services: '/services',
  finance: '/finance',
  testDrive: '/test-drive',
  journal: '/journal',
  contact: '/contact',
  about: '/about',
};
