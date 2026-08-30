/**
 * Article bodies — block-based editorial content.
 * Block types: p · h2 · quote {text, cite?} · list {items} · spec {caption, rows}
 */
export const ARTICLE_CONTENT = {
  'porsche-911-carrera-the-default-answer': [
    { type: 'p', text: 'There are cars you recommend, and cars you defend. After a week with the 992.2 Carrera on everything from the airport expressway to the hill curves past Chattogram, we understand why the 911 has been both for six decades.' },
    { type: 'h2', text: 'The hybrid nobody asked for, done properly' },
    { type: 'p', text: 'The headline change for 992.2 is the T-Hybrid system — an electric exhaust-gas turbocharger and a 48V motor-generator. On paper it sounds like compliance engineering. On the road it erases the one complaint previous Carreras earned: the half-beat of turbo lag at 2,000 rpm. Throttle response now arrives like a naturally aspirated engine with a turbocharga’s mid-range.' },
    { type: 'quote', text: 'The 911 still wins arguments without raising its voice — it simply lets the road make the point.', cite: 'Tanvir Ahmed, after 1,100 km' },
    { type: 'h2', text: 'Living with it here' },
    { type: 'p', text: 'Ground clearance is 9.1 cm at standard ride height and the front axle-lift option earns its price on speed bumps alone. Rear seats remain a shelf for soft bags; the steering remains hydraulic-honest in feel even as it is electrically assisted. Fuel quality and 40°C humidity did not upset it once.' },
    { type: 'list', items: [
      '0–100 km/h in 4.1 s, repeatable without drama',
      'Combined 11.9 km/l — remarkable for the class',
      'Rear-axle steering shrinks the car in the city',
    ] },
    { type: 'spec', caption: '992.2 Carrera — the numbers that matter', rows: [
      ['Power', '394 hp @ 7,500 rpm'],
      ['Torque', '450 Nm'],
      ['0–100 km/h', '4.1 s'],
      ['Top speed', '294 km/h'],
      ['Asking price', '৳4.2 Cr (AutoVanta floor)'],
    ] },
    { type: 'p', text: 'Is it expensive? Enormously. Is there an alternative that does the same job better? We have not driven one.' },
  ],

  'living-with-an-ev-in-dhaka-range-diary': [
    { type: 'p', text: 'For one month, a Tesla Model 3 Long Range replaced our diesel SUV for every trip — office commutes, Gulshan school runs, a weekend to Cox’s Bazar. Here is what the numbers and the nerves actually said.' },
    { type: 'h2', text: 'The real math' },
    { type: 'p', text: 'We drove 1,240 km and charged 214 kWh in total. Home wall-box charging at off-peak hours covered 80% of it; two DC fast-charging stops handled the Cox’s Bazar run. The energy bill came to roughly ৳9,100 — a comparable diesel run costs about ৳14,700 at current prices, before oil changes.' },
    { type: 'spec', caption: 'One month of EV ownership', rows: [
      ['Distance driven', '1,240 km'],
      ['Energy consumed', '214 kWh'],
      ['Charging cost', '≈ ৳9,100'],
      ['Diesel equivalent', '≈ ৳14,700'],
      ['Range anxiety incidents', '0.5 (see below)'],
    ] },
    { type: 'h2', text: 'The half anxiety incident' },
    { type: 'p', text: 'The 0.5 was self-inflicted: we left for Cox’s Bazar at 100% but ran the cabin cooling hard with a dog in the back. A 22-minute DC stop at a highway plaza solved it — lunch happened anyway. Plan around air-conditioning in summer the way you would plan around a headwind.' },
    { type: 'list', items: [
      'Charge overnight, never think about it on weekdays',
      'Regen braking transforms Dhaka stop-and-go traffic',
      'Keep the mobile charger in the boot — it is a spare tyre',
    ] },
    { type: 'p', text: 'Would we go back to petrol for city duty? The diary says no. The fuel bill is a rounding error, the cabin is silent at any speed, and the car wakes up charged.' },
  ],

  'first-luxury-car-read-before-you-sign': [
    { type: 'p', text: 'First premium purchases are emotional — that is half the point. But the paperwork rewards cold eyes. These are the three questions our sales floor hears too late.' },
    { type: 'h2', text: '1. What does it cost to keep?' },
    { type: 'p', text: 'Ask for the two-year service estimate in writing, including tyres. A ৳60 lakh sedan and a ৳60 lakh SUV can differ by 40% in running costs purely from tyre sizing and service intervals. We publish the estimate with every quote — insist on the same from anyone.' },
    { type: 'h2', text: '2. What happens to the warranty?' },
    { type: 'list', items: [
      'Manufacturer warranty follows the car, not the owner',
      'CPO programs extend coverage but read the exclusions',
      'Independent service history keeps the warranty valid if logs are stamped',
    ] },
    { type: 'h2', text: '3. What will it be worth?' },
    { type: 'p', text: 'Depreciation is the largest cost of premium ownership — not fuel, not service. White, silver, black and grey sedans from mainstream-luxury brands hold value most predictably in our market. Loud colors are wonderful; just buy them knowing the resale pool is smaller.' },
    { type: 'quote', text: 'Buy the car you will still like in year three, not the one that impresses in week one.', cite: 'Sadia Rahman' },
    { type: 'p', text: 'Bring the three questions to any showroom — including ours. The answers should be quick, printed and unhurried.' },
  ],

  'adas-explained-sensors-that-watch-blind-spots': [
    { type: 'p', text: 'Modern driver assistance is a rain of tiny measurements: radar pings, camera frames, ultrasonic chirps. Understanding what each sensor does — and cannot do — turns marketing vocabulary into something you can actually trust.' },
    { type: 'h2', text: 'The sensor cast' },
    { type: 'list', items: [
      'Camera — lane lines, traffic signs, vehicles; struggles with glare and monsoon spray',
      'Radar — distance and closing speed through rain and dust; weak on stationary objects',
      'Ultrasonics — parking ranges under 8 m; blind as a bat beyond that',
      'LiDAR — precise 3D mapping on high-end trims; cost is why it is still rare',
    ] },
    { type: 'h2', text: 'Where the magic actually happens' },
    { type: 'p', text: 'The car’s computer fuses these streams into a single model of the road. When your blind-spot monitor flashes, that is usually radar; when the lane-keep nudges the wheel, that is a camera making a judgement about painted lines. Fusion is why one sensor being confused rarely fools the whole system — and why a dirty bumper can disable cruise control on an otherwise clear day.' },
    { type: 'quote', text: 'Assistance means the car watches with you, not instead of you. The seat stays the final authority.', cite: 'Arif Chowdhury' },
    { type: 'spec', caption: 'Care and feeding of your sensors', rows: [
      ['Windshield', 'Keep the camera zone clean; recalibrate after replacement'],
      ['Rear bumper', 'Radar lives here — pressure-wash with care'],
      ['Badges', 'Radar covers behind the brand badge; cracks matter'],
    ] },
  ],

  'twin-turbo-v6s-eating-v8-lunch': [
    { type: 'p', text: 'There was a time the answer to everything was cubic inches. Then the numbers started coming in from boost-only sixes, and the arguments got quieter.' },
    { type: 'h2', text: 'The receipts' },
    { type: 'spec', caption: 'Six versus eight — the current floor', rows: [
      ['Audi RS 5 · 2.9 V6 TT', '450 hp · 600 Nm · 3.9 s'],
      ['Ford Mustang GT · 5.0 V8', '480 hp · 567 Nm · 4.6 s'],
      ['BMW M5 · 4.4 V8 + e-motor', '727 hp · 1,000 Nm · 3.5 s'],
      ['Ford Ranger Raptor · 3.0 V6 TT', '397 hp · 583 Nm'],
    ] },
    { type: 'p', text: 'Torque is where the turbo six rewrites the deal: peak twist arrives at 1,900 rpm in most applications and stays for 2,000 more. The V8 still owns the soundtrack — nothing built resonates like a flat-plane-crank howl or a well-tuned pushrod burble at 4,000 rpm.' },
    { type: 'h2', text: 'So which wins?' },
    { type: 'list', items: [
      'City and highway duty: the boosted six — torque where you actually live',
      'Emotional duty: the V8, unapologetically',
      'Track duty: whichever has the better brakes, as always',
    ] },
    { type: 'quote', text: 'Downsizing was supposed to be a compromise. The stopwatch disagreed.', cite: 'Test track notes, June 2026' },
    { type: 'p', text: 'Our floor currently stocks both philosophies. Drive them back to back — the deciding factor will not be a number.' },
  ],

  'autovanta-gec-flagship-opens-doors': [
    { type: 'p', text: 'The shutters came up this month on AutoVanta GEC — our third location and the new flagship. Twelve marques, a 12-bay workshop and the country’s first in-showroom configurator lounge, all under one roof at GEC Circle.' },
    { type: 'h2', text: 'What is inside' },
    { type: 'list', items: [
      'Display floor for 14 vehicles with two rotation stages',
      '12-bay service workshop with a dedicated EV bay',
      'Ceramic coating and PPF studio with dust-controlled air',
      'Configurator lounge — spec your car on a 98" display before you buy it',
      'Customer bay with track-side style live delivery screens',
    ] },
    { type: 'quote', text: 'We built the showroom we always wanted as customers — everything visible, nothing theatrical.', cite: 'Tanvir Ahmed, Founder' },
    { type: 'h2', text: 'Visit us' },
    { type: 'p', text: 'Zakir Hossain Road, GEC Circle, Khulshi. Open Saturday to Thursday 9:00–20:00, Friday 15:00–20:00. The coffee machine is commercial-grade and the spec sheets are honest — see for yourself.' },
  ],

  'camry-hev-the-quiet-flex': [
    { type: 'p', text: 'Nobody buys a Camry to be noticed, which is exactly why the ones who buy it get the last laugh. The fifth-generation hybrid system in the 2025 car is the quietest statement on our floor.' },
    { type: 'h2', text: 'The numbers do the talking' },
    { type: 'spec', caption: 'Camry 2.5 HEV — week with us', rows: [
      ['Combined economy', '20.5 km/l claimed · 19.8 observed'],
      ['City commute loop', '21.4 km/l'],
      ['Cabin at 80 km/h', '58 dB — library rules'],
      ['EV-mode coverage', '≈ 40% of city driving'],
    ] },
    { type: 'p', text: 'The e-CVT behaves like a well-dressed diplomat — no drone, no hesitation, no drama. Rear legroom embarrasses cars a segment above, and the rear bench folds in a 60:40 split, a Camry first worth having.' },
    { type: 'list', items: [
      'Toyota Safety Sense 3.0 standard',
      '20.5 km/l without invoking eco mode',
      '5 yr / 150K km hybrid battery peace of mind',
    ] },
    { type: 'quote', text: 'The quiet flex is not the badge — it is the fuel station you keep driving past.', cite: 'Nusrat Jahan' },
    { type: 'p', text: 'For boardroom-to-boardroom duty, nothing else this sensible comes close. Test one before you sign anything flashier.' },
  ],

  'certified-pre-owned-212-point-check': [
    { type: 'p', text: 'The CPO badge on our floor is not a wash and a sticker. Here is exactly what happens behind the workshop curtain before a car earns it.' },
    { type: 'h2', text: 'Stage one — the history' },
    { type: 'p', text: 'Before a key is turned, we pull the BRTA record, import documentation and every service log we can reach. Ownership gaps and undocumented intervals end the process here, politely but firmly.' },
    { type: 'h2', text: 'Stage two — the instrumented inspection' },
    { type: 'list', items: [
      'Paint-thickness scan across 22 panels — repainted metal reads different',
      'Borescope through cylinders — a look inside the engine before you hear it',
      'OBD fault-history readout — cleared codes leave fingerprints',
      'Chassis alignment and underbody scan on the lift',
      'Brake pad and disc wear measured, not guessed',
    ] },
    { type: 'spec', caption: 'The pass/fail lines we enforce', rows: [
      ['Panels repainted', '≤ 2, disclosed, non-structural'],
      ['Tyre life remaining', '≥ 50% or replaced'],
      ['Fault history', 'No deleted airbag or ABS codes'],
      ['Owner count', 'Documented, max 3'],
    ] },
    { type: 'quote', text: 'If a car cannot tell the truth under the gauge, it does not wear our badge.', cite: 'Arif Chowdhury, Chief Technician' },
    { type: 'p', text: 'The report that results — photos, measurements, verdicts — travels with the car. Ask to see it; it is your document too.' },
  ],

  'home-charging-101-costs-load-safety': [
    { type: 'p', text: 'The wallbox is the cheapest part of EV ownership — the questions are electrical. Here is the practical version for Bangladeshi apartments and homes.' },
    { type: 'h2', text: 'Can your building handle it?' },
    { type: 'p', text: 'A 7.4 kW AC wallbox draws about 32 A on a single phase — comparable to two air conditioners running together. Most Dhaka apartments with a 5 kVA sanction can charge overnight at reduced current (16 A) with zero infrastructure work. The math we run with your building engineer takes twenty minutes.' },
    { type: 'spec', caption: 'Charging options, honestly compared', rows: [
      ['Portable 10 A (in the boot)', '≈ 10 km range per hour · any socket'],
      ['7.4 kW wallbox', '≈ 40 km range per hour · dedicated circuit'],
      ['11 kW three-phase', '≈ 60 km range per hour · needs 3-phase supply'],
      ['DC 50 kW+', 'Highway stops only · 15–40 min top-ups'],
    ] },
    { type: 'h2', text: 'The bill, translated' },
    { type: 'list', items: [
      '1,200 km/month ≈ 210 kWh ≈ ৳2,300–2,900 at current tariffs',
      'Off-peak charging where metering allows trims 15–20% further',
      'The wallbox itself: installed, ৳65,000–95,000 depending on cable run',
    ] },
    { type: 'quote', text: 'Treat the wallbox like a construction decision, not a gadget purchase — certified installer, RCD protection, dedicated breaker.', cite: 'Arif Chowdhury' },
    { type: 'p', text: 'Our EV desk coordinates a free load assessment with every electric vehicle sold — bring your building’s sanction letter.' },
  ],

  'brake-tech-why-your-next-car-stops-shorter': [
    { type: 'p', text: 'Horsepower sells cars; deceleration saves them. The quiet arms race inside your wheels has produced gains worth understanding before your next purchase.' },
    { type: 'h2', text: 'What changed' },
    { type: 'list', items: [
      'Fixed multi-piston calipers migrated from supercars to crossovers',
      'Dual-cast and carbon-ceramic discs resist fade on hill descents',
      'Regenerative blending lets EVs brake without touching friction material',
      'Brake-by-wire pedals tune feel independently of hardware',
    ] },
    { type: 'spec', caption: 'Braking 100–0 km/h, current floor', rows: [
      ['Tesla Model 3 LR', '36.5 m'],
      ['Porsche 911 Carrera', '33.5 m'],
      ['Toyota Fortuner GR', '38.5 m'],
      ['Audi RS 5', '34.5 m'],
    ] },
    { type: 'p', text: 'Two body-lengths separate the best and worst of our floor — on the expressway that is the gap between a close call and a claim number. Tyres matter as much as calipers; a great brake on hard-compound rubber is a polite suggestion.' },
    { type: 'quote', text: 'The fastest car in a straight line is the one that brakes latest into the corner — buy accordingly.', cite: 'Tanvir Ahmed' },
    { type: 'p', text: 'Every AutoVanta inspection measures brake wear and verifies fade behavior on our test route. The numbers are in the report because they should be in your decision.' },
  ],

  'infotainment-wars-screens-vs-buttons': [
    { type: 'p', text: 'Somewhere between the third haptic slider and the fifth sub-menu, the industry forgot that drivers are operating a moving vehicle. The correction is now underway — here is where the line is being redrawn.' },
    { type: 'h2', text: 'The backlash is real' },
    { type: 'p', text: 'Euro NCAP announced that from 2026, physical controls for core functions factor into safety scoring. Volkswagen has admitted the touch-slider era was a mistake and is re-adding buttons. Hyundai — long a holdout of sensible switchgear — suddenly looks prophetic.' },
    { type: 'list', items: [
      'Climate and volume deserve permanent, tactile controls',
      'Everything else can live in a screen if voice works properly',
      'A dead-simple cluster beats a beautiful distraction',
    ] },
    { type: 'h2', text: 'What we tell buyers' },
    { type: 'p', text: 'On our floor, we ask you to adjust the air-conditioning at a standstill — then imagine it at 100 km/h in Chattogram rain. The cars that pass that test comfortably tend to come from the same two or three brands. You will notice the pattern within a week of driving.' },
    { type: 'quote', text: 'A screen is not a feature. A two-second task is the feature.', cite: 'Arif Chowdhury' },
    { type: 'p', text: 'Test the controls like you test the engine — the annoyance you feel on Tuesday is the one you live with for five years.' },
  ],

  '2026-lineups-whats-landing-in-bangladesh': [
    { type: 'p', text: 'Our import desk tracks every confirmed allocation for the rest of 2026. Here is the honest forecast — what is genuinely landing, and what is still a rumor with a brochure.' },
    { type: 'h2', text: 'Confirmed arrivals' },
    { type: 'list', items: [
      'Tesla Model Y Performance — first quarter allocation sold out; second tranche open',
      'Hyundai IONIQ 5 facelift — bigger battery, rear-drive base return',
      'Toyota Camry HEV — continuous, waiting period ~6 weeks',
      'BMW i4 eDrive40 — steady pipeline, two per month',
    ] },
    { type: 'h2', text: 'Probable, not promised' },
    { type: 'p', text: 'Two EV crossovers from Korea and one performance coupe return are at the paperwork stage. Import duty calculations for the coupe segment remain the deciding factor — our desk will publish the moment the gazette lands.' },
    { type: 'spec', caption: 'Waiting periods, current floor', rows: [
      ['In-stock vehicles', 'Delivery in 3–5 working days'],
      ['CPO units', '48-hour inspection turnaround'],
      ['Pre-orders', '6–14 weeks depending on brand'],
    ] },
    { type: 'quote', text: 'Buy the car on the floor, not the one in the rumor. The floor one has a price and a production date.', cite: 'Sadia Rahman' },
    { type: 'p', text: 'The full list updates monthly — ask the desk, or watch this journal’s News category.' },
  ],
};
