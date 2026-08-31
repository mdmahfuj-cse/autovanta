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

  );
}
