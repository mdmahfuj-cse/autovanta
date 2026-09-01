import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from './paths.js';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path={PATHS.home} element={<HomePage />} />
      <Route path={PATHS.cars} element={<CarsPage />} />
      <Route path={PATHS.carDetails(':slug')} element={<CarDetailsPage />} />
      <Route path={PATHS.brands} element={<BrandsPage />} />
      <Route path={PATHS.brandDetails(':slug')} element={<BrandDetailsPage />} />
      <Route path={PATHS.compare} element={<ComparePage />} />
      <Route path={PATHS.wishlist} element={<WishlistPage />} />
      <Route path={PATHS.services} element={<ServicesPage />} />
      <Route path={PATHS.serviceDetails(':slug')} element={<ServiceDetailsPage />} />
      <Route path={PATHS.finance} element={<FinancePage />} />
      <Route path={PATHS.testDrive} element={<TestDrivePage />} />
      <Route path={PATHS.journal} element={<JournalPage />} />
      <Route path={PATHS.article(':slug')} element={<ArticlePage />} />
      <Route path={PATHS.about} element={<AboutPage />} />
      <Route path={PATHS.contact} element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
