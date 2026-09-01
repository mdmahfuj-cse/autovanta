import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from './paths.js';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const CarsPage = lazy(() => import('../pages/CarsPage.jsx'));
const CarDetailsPage = lazy(() => import('../pages/CarDetailsPage.jsx'));
const BrandsPage = lazy(() => import('../pages/BrandsPage.jsx'));
const BrandDetailsPage = lazy(() => import('../pages/BrandDetailsPage.jsx'));
const ComparePage = lazy(() => import('../pages/ComparePage.jsx'));
const WishlistPage = lazy(() => import('../pages/WishlistPage.jsx'));
const ServicesPage = lazy(() => import('../pages/ServicesPage.jsx'));
const ServiceDetailsPage = lazy(() => import('../pages/ServiceDetailsPage.jsx'));
const FinancePage = lazy(() => import('../pages/FinancePage.jsx'));
const TestDrivePage = lazy(() => import('../pages/TestDrivePage.jsx'));
const JournalPage = lazy(() => import('../pages/JournalPage.jsx'));
const ArticlePage = lazy(() => import('../pages/ArticlePage.jsx'));
const AboutPage = lazy(() => import('../pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('../pages/ContactPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

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
