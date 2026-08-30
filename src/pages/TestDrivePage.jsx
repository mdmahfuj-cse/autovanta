import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import TestDriveForm from '../features/test-drive/TestDriveForm.jsx';
import ConfirmationCard from '../features/test-drive/ConfirmationCard.jsx';
import BookingsList from '../features/test-drive/BookingsList.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { FLAGSHIP_SHOWROOM } from '../data/index.js';
import { PATHS } from '../routes/paths.js';
import { Link } from 'react-router-dom';

export default function TestDrivePage() {
  useDocumentTitle('Book a Test Drive');
  const [searchParams] = useSearchParams();
  // Deep link from vehicle pages: /test-drive?car=slug
  const prefillCarId = searchParams.get('car') ?? '';
  const [confirmation, setConfirmation] = useState(null);

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Test drive · free 30 minutes
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Feel it from <span className="text-secondary">the driver&apos;s seat</span>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Pick the machine, the time and the showroom. We&apos;ll confirm within the hour during
            business hours — or call {FLAGSHIP_SHOWROOM.phone} directly.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <AnimatePresence mode="wait">
            {confirmation ? (
              <ConfirmationCard key="confirmation" booking={confirmation} onBookAnother={() => setConfirmation(null)} />
            ) : (
              <Reveal key="form">
                <div className="rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8">
                  <h2 className="font-display text-2xl font-bold tracking-tight">Booking details</h2>
                  <p className="mt-1.5 text-sm text-muted">
                    {prefillCarId ? 'Your pick is pre-selected — just add a time.' : 'Under a minute to fill in.'}
                  </p>
                  <div className="mt-7">
                    <TestDriveForm prefillCarId={prefillCarId} onBooked={setConfirmation} />
                  </div>
                </div>
              </Reveal>
            )}
          </AnimatePresence>

          <BookingsList />
        </div>

        {/* Side info */}
        <Reveal delay={0.1}>
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/10 bg-base-200 p-6">
              <h3 className="font-display text-lg font-bold tracking-tight">How it works</h3>
              <ol className="mt-4 space-y-4">
                {[
                  ['Book online or by phone', 'Pick a slot — instant confirmation reference.'],
                  ['We prep the car', 'Fueled, charged, detailed and pulled to the front bay.'],
                  ['Drive your route', 'City, highway or both — a specialist rides along first.'],
                  ['Zero pressure', 'No on-the-spot deals. Take the number home and think.'],
                ].map(([title, body], i) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] font-mono text-xs">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-0.5 text-sm text-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-white/10 bg-base-200 p-6">
              <h3 className="font-display text-lg font-bold tracking-tight">Opening hours</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li className="flex justify-between gap-4">
                  <span>Saturday – Thursday</span>
                  <span className="font-mono text-base-content/85">9:00 – 20:00</span>
                </li>
                <li className="flex justify-between gap-4 border-t border-white/8 pt-2.5">
                  <span>Friday</span>
                  <span className="font-mono text-base-content/85">15:00 – 20:00</span>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Slots at all three showrooms — Gulshan, GEC Chattogram (flagship) and Sylhet. Choose
                whichever is closest in the form, or{' '}
                <Link to={PATHS.contact} className="text-base-content underline-offset-4 transition-colors hover:text-primary-text hover:underline">
                  see addresses
                </Link>
                .
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </PageTransition>
  );
}
