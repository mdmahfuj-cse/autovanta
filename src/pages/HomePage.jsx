import PageTransition from '../components/shared/PageTransition.jsx';
import Hero from '../features/home/Hero.jsx';
import FeaturedCars from '../features/home/FeaturedCars.jsx';
import BrandStrip from '../features/home/BrandStrip.jsx';
import CategoryMosaic from '../features/home/CategoryMosaic.jsx';
import PerformanceSpotlight from '../features/home/PerformanceSpotlight.jsx';
import NewArrivals from '../features/home/NewArrivals.jsx';
import ComparePreview from '../features/home/ComparePreview.jsx';
import ServicesPreview from '../features/home/ServicesPreview.jsx';
import FinancePreview from '../features/home/FinancePreview.jsx';
import TestDriveCta from '../features/home/TestDriveCta.jsx';
import JournalPreview from '../features/home/JournalPreview.jsx';
import ShowroomSection from '../features/home/ShowroomSection.jsx';
import FinalCta from '../features/home/FinalCta.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

/**
 * The long cinematic homepage.
 * §1 Hero · §2 Featured · §3 Brands · §4 Categories · §5 Performance
 * §6 New arrivals · §7 Compare · §8 Services · §9 Finance · §10 Test drive
 * §11 Journal · §12 Showrooms · §13 Final CTA · (§14 footer lives in layout)
 */
export default function HomePage() {
  useDocumentTitle('');

  return (
    <PageTransition>
      <Hero />
      <FeaturedCars />
      <BrandStrip />
      <CategoryMosaic />
      <PerformanceSpotlight />
      <NewArrivals />
      <ComparePreview />
      <ServicesPreview />
      <FinancePreview />
      <TestDriveCta />
      <JournalPreview />
      <ShowroomSection />
      <FinalCta />
    </PageTransition>
  );
}
