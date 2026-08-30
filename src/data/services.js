import {
  CircleDot,
  ClipboardCheck,
  Droplets,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from 'lucide-react';

/**
 * AutoVanta service desk — 8 workshop-grade services.
 * Price fields are raw BDT ("from" pricing); 0 = complimentary.
 */
export const SERVICES = [
  {
    slug: 'pre-purchase-inspection',
    title: 'Pre-Purchase Inspection',
    icon: ClipboardCheck,
    tagline: '212 checkpoints before you commit to anything.',
    description:
      'Our master technicians inspect every vehicle across 212 points — mechanical, electrical, structural and cosmetic — and hand you the same report we use internally. No surprises after the handshake.',
    priceFrom: 4500,
    duration: '90 minutes',
    includes: [
      'Engine, drivetrain and suspension health scan',
      'OBD telemetry & fault-history readout',
      'Chassis, underbody and accident-repair check',
      'Paint-thickness measurement across all panels',
      'Written 212-point report with photos',
    ],
    process: [
      'Book a slot and drop the vehicle (or we collect it)',
      'Baseline scan and fault-history readout',
      'Ramp inspection of underbody and suspension',
      'Panel-by-panel paint and trim assessment',
      'Report walkthrough with a technician',
    ],
  },
  {
    slug: 'scheduled-maintenance',
    title: 'Scheduled Maintenance',
    icon: Wrench,
    tagline: 'Factory schedules, dealer discipline.',
    description:
      'Manufacturer-spec periodic maintenance with genuine or OEM-equivalent parts, digital service records and a loaner car when the job runs long.',
    priceFrom: 8500,
    duration: '2 – 4 hours',
    includes: [
      'Oil & filter change (brand-spec grade)',
      '61-point mechanical & safety check',
      'Fluid top-ups and brake inspection',
      'Digital service record update',
      'Wash & interior vacuum',
    ],
    process: [
      'Service booking with pickup option',
      'Digital health check & estimate approval',
      'Maintenance by certified technicians',
      'Road test and quality sign-off',
      'Records delivered to your account',
    ],
  },
  {
    slug: 'studio-detailing',
    title: 'Studio Detailing',
    icon: Sparkles,
    tagline: 'Showroom gloss, preserved by hand.',
    description:
      'A full decontamination and multi-stage paint correction in our dust-controlled bay, finished with a sealant tuned to Bangladeshi monsoon conditions.',
    priceFrom: 12000,
    duration: '4 – 8 hours',
    includes: [
      'Two-bucket hand wash & iron decontamination',
      'Clay bar treatment',
      'Single or multi-stage machine polish',
      'Monsoon-grade paint sealant',
      'Interior deep clean & leather feed',
    ],
    process: [
      'Paint assessment under inspection light',
      'Decontamination and clay treatment',
      'Machine polish to correct swirl & scratches',
      'Sealant or wax application',
      'Final inspection under colour-matched light',
    ],
  },
  {
    slug: 'ceramic-coating',
    title: 'Ceramic Coating',
    icon: Droplets,
    tagline: 'A sacrificial layer that outlives the warranty.',
    description:
      'A 9H ceramic layer chemically bonded to your paint — years of hydrophobic gloss, easier washes and real protection from sun, rain and road grime.',
    priceFrom: 45000,
    duration: '1 – 2 days',
    includes: [
      'Full paint correction before application',
      'Two layers of 9H ceramic on painted panels',
      'Wheel-face coating',
      'Glass hydrophobic treatment',
      '36-month performance warranty',
    ],
    process: [
      'Deep decontamination & clay',
      'Multi-stage paint correction',
      'Panel wipe and controlled application',
      'Infrared curing between layers',
      'Care briefing + aftercare kit',
    ],
  },
  {
    slug: 'paint-protection-film',
    title: 'Paint Protection Film',
    icon: Layers,
    tagline: 'Invisible armour for the daily grind.',
    description:
      'Self-healing urethane PPF, plotter-cut for your exact model. Stone chips, gate scratches and monsoon grit hit the film — not your paint.',
    priceFrom: 85000,
    duration: '2 – 3 days',
    includes: [
      'Full-front or full-body coverage options',
      'Plotter-cut kits — no blade on paint',
      'Self-healing top coat',
      'Edge wrapping on high-impact panels',
      '10-year film warranty',
    ],
    process: [
      'Panel measurement and kit selection',
      'Final polish before application',
      'Plotter-cut film application in clean bay',
      'Heat-forming on complex curves',
      'Cure period and inspection',
    ],
  },
  {
    slug: 'customisation',
    title: 'Customisation Studio',
    icon: SlidersHorizontal,
    tagline: 'Your spec, engineered properly.',
    description:
      'From wheels and styling kits to suspension and exhaust work — specified, installed and aligned in-house, with the paperwork to keep it street-legal.',
    priceFrom: 25000,
    duration: 'By quote',
    includes: [
      'Design consultation with renders',
      'Genuine / TÜV-approved parts sourcing',
      'In-house fitment and alignment',
      'BRTA-compliant documentation support',
    ],
    process: [
      'Consultation and part specification',
      'Quotation and lead-time confirmation',
      'Fitment in the customisation bay',
      'Alignment, calibration and road test',
    ],
  },
  {
    slug: 'tyre-care',
    title: 'Tyre & Alignment',
    icon: CircleDot,
    tagline: 'Four contact patches, zero excuses.',
    description:
      'Tyre sales, rotation, repair and computerised 3D alignment — the cheapest way to protect an expensive set of tyres and stay honest on fuel.',
    priceFrom: 6500,
    duration: '60 minutes',
    includes: [
      '3D computerised wheel alignment',
      'Balancing and rotation',
      'Puncture repair (patch method)',
      'TPMS reset & calibration',
    ],
    process: [
      'Tyre and suspension inspection',
      'Alignment readings before/after',
      'Balancing and torque-to-spec fitment',
      'Road-test verification',
    ],
  },
  {
    slug: 'insurance-assistance',
    title: 'Insurance Assistance',
    icon: ShieldCheck,
    tagline: 'We argue with the paperwork so you don\'t.',
    description:
      'Renewals, claims and survey coordination for comprehensive and third-party policies — handled end-to-end by our documentation desk.',
    priceFrom: 0,
    duration: '30 minutes',
    includes: [
      'Policy comparison across 6 insurers',
      'Claim documentation & submission',
      'Surveyor coordination at our workshop',
      'Cashless repair-network handling',
    ],
    process: [
      'Requirement review and policy comparison',
      'Application or claim initiation',
      'Survey and damage assessment scheduling',
      'Approval, repair and delivery',
    ],
  },
];

export const SERVICES_BY_SLUG = Object.fromEntries(SERVICES.map((s) => [s.slug, s]));
