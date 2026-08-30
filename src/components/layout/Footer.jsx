import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import { PATHS } from '../../routes/paths.js';

const SHOWROOM_LINKS = [
  { label: 'Explore Cars', to: PATHS.cars },
  { label: 'Brands', to: PATHS.brands },
  { label: 'Compare Garage', to: PATHS.compare },
  { label: 'Wishlist', to: PATHS.wishlist },
  { label: 'Book a Test Drive', to: PATHS.testDrive },
];

const EXPERIENCE_LINKS = [
  { label: 'Finance Calculator', to: PATHS.finance },
  { label: 'Services', to: PATHS.services },
  { label: 'Automotive Journal', to: PATHS.journal },
  { label: 'About AutoVanta', to: PATHS.about },
  { label: 'Contact', to: PATHS.contact },
];

function LinkColumn({ title, links, label }) {
  return (
    <nav aria-label={label}>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-content/80">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-neutral-content/80 transition-colors hover:text-base-content"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral">
      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-16">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-content/80">
            A premium automotive showroom concept for Bangladesh — curated vehicles, transparent
            comparisons and a finance desk that does the math for you.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-content/80">
            Dhaka · Chattogram · Sylhet
          </p>
        </div>

        <LinkColumn title="Showroom" links={SHOWROOM_LINKS} label="Showroom links" />
        <LinkColumn title="Experience" links={EXPERIENCE_LINKS} label="Experience links" />

        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-content/80">
            Flagship — Chattogram
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-content/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <span>AutoVanta GEC, Zakir Hossain Road, Khulshi, Chattogram 4210</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <a href="tel:+8801812345678" className="font-mono transition-colors hover:text-base-content">
                +880 18 1234 5678
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <a href="mailto:hello@autovanta.example" className="transition-colors hover:text-base-content">
                hello@autovanta.example
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <span>
                Sat–Thu · 9:00–20:00
                <br />
                Fri · 15:00–20:00
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-neutral-content/80 md:flex-row md:items-center md:justify-between">
          <p>© 2026 AutoVanta. A frontend concept — all vehicles, prices and articles are illustrative mock data.</p>
          <p className="font-mono">React · Motion · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
