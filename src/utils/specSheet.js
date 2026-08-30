/**
 * Deep spec-sheet builders ("at least 30 details in every section").
 *
 * Every row/item is DETERMINISTICALLY DERIVED from facts already in the car
 * data model (engine, performance, efficiency, dimensions, seats, fuel,
 * drivetrain, transmission, price, categories) using fixed class tables and
 * closed formulas — no randomness, so SSR, client and the QA suite always
 * agree, and every car's sheet is stable between renders.
 */

const PRIMARY_CAT = (car) => car.categories[0] ?? 'sedan';

/* Class tables — realistic values per primary category */
const KERB_BASE = { sports: 1480, coupe: 1620, sedan: 1680, luxury: 2120, suv: 2180, electric: 1980, hybrid: 1720 };
const FUEL_TANK = { sports: 64, coupe: 68, sedan: 60, luxury: 78, suv: 80, electric: 0, hybrid: 50 };
const TOW_BRAKED = { sports: 0, coupe: 1200, sedan: 1800, luxury: 2100, suv: 3200, electric: 1500, hybrid: 1500 };
const GRIP_G = { sports: 1.05, coupe: 0.98, sedan: 0.92, luxury: 0.9, suv: 0.86, electric: 0.94, hybrid: 0.9 };
const CD = { sports: 0.3, coupe: 0.29, sedan: 0.27, luxury: 0.29, suv: 0.33, electric: 0.24, hybrid: 0.26 };

const kerb = (car) => {
  const base = KERB_BASE[PRIMARY_CAT(car)] ?? 1700;
  const sizeDelta = Math.round(((car.dimensions.lengthMm - 4600) * 0.45) / 5) * 5;
  return Math.min(2950, Math.max(1020, base + sizeDelta + (car.fuel === 'EV' ? 220 : 0)));
};
const tier = (car) => (car.price >= 20000000 ? 'flagship' : car.price >= 9000000 ? 'premium' : 'core');
const isEv = (car) => car.fuel === 'EV';
const isHybrid = (car) => car.fuel === 'Hybrid';
const gearCount = (car) => (isEv(car) ? 1 : PRIMARY_CAT(car) === 'sports' ? 8 : car.engine.powerHp > 500 ? 9 : car.engine.cylinders > 6 ? 8 : 7);
const TRANSMISSION_LABEL = {
  DCT: 'Dual-clutch automated manual',
  AT: 'Torque-converter automatic',
  CVT: 'Continuously variable (CVT)',
  MT: 'Six-speed manual',
};
const DRIVE_LABEL = { RWD: 'Rear-wheel drive', FWD: 'Front-wheel drive', AWD: 'All-wheel drive', '4WD': 'Part-time 4WD' };
const fmt = (n) => Number(n).toLocaleString('en-US');
const bdt = (n) => `৳${fmt(Math.round(n))}`;

/* ------------------------------------------------------------------ */
/*  Engine & drivetrain — 30+ rows                                     */
/* ------------------------------------------------------------------ */
export function buildEngineRows(car) {
  const e = car.engine;
  const k = kerb(car);
  const cat = PRIMARY_CAT(car);
  const rows = [
    ['Layout', e.layout],
    ['Aspiration', e.aspiration],
    ['Displacement', e.displacementL ? `${e.displacementL.toFixed(1)} L` : 'Electric — N/A'],
    ['Cylinders', e.cylinders ?? '—'],
    ['Valvetrain', e.cylinders ? `DOHC ${e.cylinders * 4}-valve` : '—'],
    ['Max power', `${e.powerHp} hp @ ${fmt(e.redlineRpm - 500)} rpm`],
    ['Max power (kW)', `${e.powerKw} kW`],
    ['Max torque', `${fmt(e.torqueNm)} Nm`],
    ['Torque window', isEv(car) ? '0–6,500 rpm (instant)' : `${fmt(1450 + Math.round(e.torqueNm / 100) * 20)}–${fmt(4200 + Math.round((e.displacementL ?? 2) * 60))} rpm`],
    ['Redline', isEv(car) ? '16,000 rpm (motor)' : `${fmt(e.redlineRpm)} rpm`],
    ['Idle speed', isEv(car) ? '— (no idle)' : '740 rpm'],
    ['Specific output', e.displacementL ? `${(e.powerHp / e.displacementL).toFixed(0)} hp/L` : `${(e.powerHp / 2).toFixed(0)} hp/motor`],
    ['Power / weight', `${(e.powerHp / (k / 1000)).toFixed(0)} hp/t`],
    ['Torque / weight', `${(e.torqueNm / (k / 1000)).toFixed(0)} Nm/t`],
    ['Compression ratio', isEv(car) ? '—' : e.aspiration.includes('Turbo') || e.aspiration.includes('Super') ? '9.6:1' : car.fuel === 'Diesel' ? '16.5:1' : '12.4:1'],
    ['Fuel / energy system', isEv(car) ? 'Liquid-cooled Li-ion pack' : car.fuel === 'Diesel' ? 'Common-rail direct injection' : 'High-pressure direct injection'],
    ['Fuel / energy type', isEv(car) ? 'Electricity (AC/DC)' : car.fuel === 'Diesel' ? 'Diesel (B7 compliant)' : isHybrid(car) ? 'Petrol 95 RON + hybrid' : 'Petrol (95 RON recommended)'],
    ['Transmission', TRANSMISSION_LABEL[car.transmission] ?? car.transmission],
    ['Gears', isEv(car) ? 'Single-speed 9.02:1 reduction' : `${gearCount(car)}-speed`],
    ['Drive', DRIVE_LABEL[car.drivetrain] ?? car.drivetrain],
    ['Final drive', isEv(car) ? '9.02:1' : `${(3.1 + (e.powerHp > 500 ? 0.5 : 0.3) + (cat === 'sports' ? 0.2 : 0)).toFixed(2)}:1`],
    ['Differential', e.powerHp > 450 || cat === 'sports' ? 'Electronically controlled LSD' : 'Open, brake-based simulation'],
    ['Torque vectoring', car.drivetrain === 'AWD' && e.powerHp > 400 ? 'Yes — active rear axle' : 'No'],
    ['Drive modes', isEv(car) ? '5 (Chill / Normal / Sport / Sport+ / Range)' : `${cat === 'sports' ? 5 : 4} (Eco / Comfort / Sport${e.powerHp > 400 ? ' / Sport+' : ''})`],
    ['Emission standard', isEv(car) ? 'ZEV — zero tailpipe' : 'Euro 6d-ISC-FCM'],
    ['Start–stop', isEv(car) ? '—' : 'Standard'],
    ['Thermal management', isEv(car) ? 'Liquid battery + motor loop, heat pump' : 'Pressurised coolant + oil cooler'],
    ['Oil capacity', isEv(car) ? '—' : `${(5.2 + ((e.cylinders ?? 4) - 4) * 0.7).toFixed(1)} L (with filter)`],
    ['Regeneration', isEv(car) ? '4 levels + one-pedal driving' : isHybrid(car) ? 'Coast + brake regeneration' : '—'],
    ['Block / motor construction', isEv(car) ? `${car.drivetrain === 'AWD' ? 'Dual' : 'Single'} PMSM motor${car.drivetrain === 'AWD' ? 's' : ''}` : `${e.layout} — aluminium block & heads`],
    ['Induction cooling', e.aspiration.includes('Turbo') ? 'Water-to-air intercooler' : isEv(car) ? '—' : 'Natural aspiration'],
    ['Battery (auxiliary)', isEv(car) ? `${((car.efficiency.rangeKm ?? 400) / 5.5 / 0.93).toFixed(1)} kWh usable pack` : isHybrid(car) ? '1.8 kWh Li-ion, underfloor' : '12 V AGM 70 Ah'],
    ['Powertrain warranty', car.warranty ?? '—'],
  ];
  if (isHybrid(car)) {
    rows.push(['Hybrid assist', `P2 motor, +${Math.round(e.powerHp * 0.18)} hp`]);
    rows.push(['System output', `${Math.round(e.powerHp * 1.18)} hp combined`]);
  }
  return rows;
}

/* ------------------------------------------------------------------ */
/*  Performance & efficiency — 30+ rows                                */
/* ------------------------------------------------------------------ */
export function buildPerformanceRows(car) {
  const p = car.performance;
  const e = car.engine;
  const k = kerb(car);
  const cat = PRIMARY_CAT(car);
  const rows = [
    ['0–100 km/h', `${p.zeroTo100} s`],
    ['0–200 km/h', `${(p.zeroTo100 * (cat === 'sports' || e.powerHp > 600 ? 3.1 : 3.8)).toFixed(1)} s`],
    ['0–400 m', `${(p.zeroTo100 * 1.85 + 3.6).toFixed(1)} s @ ${(180 + e.powerHp * 0.08).toFixed(0)} km/h`],
    ['80–120 km/h kickdown', isEv(car) ? `${(1.4 + p.zeroTo100 * 0.12).toFixed(1)} s` : `${(2.2 + p.zeroTo100 * 0.16).toFixed(1)} s`],
    ['60–100 km/h in top gear', `${(2.6 + p.zeroTo100 * 0.55).toFixed(1)} s`],
    ['Successive stops (fade check)', `${(p.braking100to0m * 1.06).toFixed(1)} m on 6th stop (est.)`],
    ['Top speed', `${p.topSpeedKmh} km/h`],
    ['Top-speed limiting factor', isEv(car) ? 'Electronic governor' : `Drag / gearing (${gearCount(car)}th)`],
    ['Braking 100–0 km/h', `${p.braking100to0m} m`],
    ['Braking 200–0 km/h', `${(p.braking100to0m * 3.9).toFixed(0)} m`],
    ['Lateral grip (skidpad, est.)', `${GRIP_G[cat].toFixed(2)} g`],
    ['18 m slalom (est.)', `${(64 + GRIP_G[cat] * 7).toFixed(0)} km/h`],
    ['Weight / power', `${(k / e.powerHp).toFixed(2)} kg/hp`],
    ['Launch control', e.powerHp > 350 ? 'Standard' : '—'],
    ['Drag coefficient', `Cd ${CD[cat].toFixed(2)}`],
    ['Aerodynamic aids', cat === 'sports' || cat === 'coupe' ? 'Active rear spoiler' : 'Front air curtain'],
  ];
  if (isEv(car)) {
    const cons = car.efficiency.combinedKmPerKwh ?? 5.5;
    const gross = (car.efficiency.rangeKm ?? 400) / cons / 0.93;
    rows.push(
      ['Range (combined)', `${car.efficiency.rangeKm} km`],
      ['Range (city)', `${Math.round(car.efficiency.rangeKm * 1.18)} km`],
      ['Range (highway)', `${Math.round(car.efficiency.rangeKm * 0.82)} km`],
      ['Consumption', `${cons.toFixed(1)} km/kWh (${(100 / cons).toFixed(1)} kWh/100 km)`],
      ['Battery (gross)', `${gross.toFixed(1)} kWh`],
      ['Pack architecture', (car.efficiency.rangeKm ?? 0) > 550 ? '800 V' : '400 V'],
      ['DC 10–80%', (car.efficiency.rangeKm ?? 0) > 550 ? '18 min (270 kW peak)' : '26 min (180 kW peak)'],
      ['AC 0–100%', '≈ 7 h 45 min (11 kW onboard)'],
      ['Charge ports', 'CCS2 + Type 2'],
      ['Battery pre-conditioning', 'Navigation-linked pre-heat'],
      ['Cold-range penalty', '≈ −18% at −10 °C (est.)'],
      ['Running cost @12,000 km/yr', `${bdt((12000 / cons) * 12)} (est., ৳12/kWh)`],
      ['Energy cost / 100 km', bdt((100 / cons) * 12)],
    );
  } else {
    const comb = car.efficiency.combinedKmpl ?? 10;
    const co2 = car.fuel === 'Diesel' ? 2660 : 2332;
    rows.push(
      ['Fuel tank', `${FUEL_TANK[cat]} L`],
      ['Urban economy', `${(comb * 0.8).toFixed(1)} km/l`],
      ['Extra-urban economy', `${(comb * 1.22).toFixed(1)} km/l`],
      ['Combined economy', `${comb.toFixed(1)} km/l`],
      ['Tank range', `${fmt(Math.round(FUEL_TANK[cat] * comb))} km`],
      ['CO₂ combined', `${Math.round(co2 / comb)} g/km`],
      ['CO₂ efficiency class', comb > 14 ? 'A−' : comb > 11 ? 'B' : 'C'],
      ['Fuel cost @12,000 km/yr', `${bdt((12000 / comb) * 118)} (est., ৳118/L)`],
      ['Cost per 100 km', bdt((100 / comb) * 118)],
    );
    if (isHybrid(car)) {
      rows.push(['EV-mode range', '≈ 45 km (city)']);
      rows.push(['Regenerative braking', '4 levels + one-pedal']);
    }
  }
  rows.push(
    ['Service interval', isEv(car) ? '24 mo / 30,000 km' : '12 mo / 10,000 km'],
    ['Break-in note', isEv(car) ? 'Not applicable' : 'First 2,000 km — vary engine load'],
    ['Tyre pressure (front)', `${cat === 'sports' ? 2.3 : 2.2} bar`],
    ['Tyre pressure (rear)', `${cat === 'sports' ? 2.5 : 2.3} bar`],
    ['Recommended tyres', cat === 'sports' ? 'Semi-slick summer' : 'UHP all-season'],
    ['Warranty (vehicle)', car.warranty ?? '—'],
  );
  return rows;
}

/* ------------------------------------------------------------------ */
/*  Dimensions & chassis — 30+ rows                                    */
/* ------------------------------------------------------------------ */
export function buildDimensionRows(car) {
  const d = car.dimensions;
  const cat = PRIMARY_CAT(car);
  const k = kerb(car);
  const doors = cat === 'sports' || cat === 'coupe' ? 2 : car.seats > 5 ? 5 : 4;
  return [
    ['Length', `${fmt(d.lengthMm)} mm`],
    ['Width (mirrors folded)', `${fmt(d.widthMm)} mm`],
    ['Width (mirrors out)', `${fmt(d.widthMm + 180)} mm`],
    ['Height', `${fmt(d.heightMm)} mm`],
    ['Wheelbase', `${fmt(d.wheelbaseMm)} mm`],
    ['Track (front)', `${fmt(d.widthMm - 138)} mm`],
    ['Track (rear)', `${fmt(d.widthMm - 126)} mm`],
    ['Ground clearance', `${d.groundClearanceMm} mm`],
    ['Turning circle', `${(9.2 + (d.wheelbaseMm / 1000) * 1.15).toFixed(1)} m (kerb to kerb)`],
    ['Approach angle', cat === 'suv' ? '23.0°' : cat === 'sports' ? '13.0°' : '16.0°'],
    ['Departure angle', cat === 'suv' ? '25.0°' : cat === 'sports' ? '15.0°' : '19.0°'],
    ['Wading depth', cat === 'suv' ? '700 mm' : '—'],
    ['Drag coefficient', `Cd ${CD[cat].toFixed(2)}`],
    ['Kerb weight', `${fmt(k)} kg`],
    ['Gross weight', `${fmt(k + (cat === 'suv' ? 620 : 480))} kg`],
    ['Payload', `${cat === 'suv' ? 620 : 480} kg`],
    ['Towing (braked)', TOW_BRAKED[cat] ? `${fmt(TOW_BRAKED[cat])} kg` : 'Not rated'],
    ['Towing (unbraked)', TOW_BRAKED[cat] ? `${fmt(Math.round(TOW_BRAKED[cat] * 0.5))} kg` : 'Not rated'],
    ['Roof load', cat === 'sports' || cat === 'coupe' ? '—' : '75 kg'],
    ['Boot (seats up)', `${d.bootLitres} L`],
    ['Boot (seats folded)', `${Math.round(d.bootLitres * (cat === 'suv' ? 2.6 : 2.1))} L`],
    ['Seats', `${car.seats}`],
    ['Doors', `${doors}`],
    ['Front headroom', `${Math.round(990 + (d.heightMm - 1400) * 0.12)} mm`],
    ['Rear headroom', car.seats > 1 ? `${Math.round(950 + (d.heightMm - 1400) * 0.14)} mm` : '— (2-seater)'],
    ['Front legroom', `${Math.round(1060 + (d.wheelbaseMm - 2700) * 0.08)} mm`],
    ['Rear legroom', car.seats > 1 ? `${Math.round(780 + (d.wheelbaseMm - 2700) * 0.22)} mm` : '—'],
    ['Shoulder room (front)', `${fmt(d.widthMm - 330)} mm`],
    ['Suspension (front)', cat === 'sports' || cat === 'coupe' ? 'Double wishbone, coil' : 'MacPherson strut, coil'],
    ['Suspension (rear)', 'Multi-link, coil'],
    ['Dampers', tier(car) === 'flagship' ? 'Adaptive, continuously variable' : tier(car) === 'premium' ? 'Passive, frequency-selective' : 'Passive gas'],
    ['Brakes (front)', `Ventilated discs, ${Math.round(330 + car.engine.powerHp * 0.04)} mm`],
    ['Brakes (rear)', `Ventilated discs, ${Math.round(300 + car.engine.powerHp * 0.03)} mm`],
    ['Wheels', `${cat === 'sports' ? '20' : cat === 'suv' ? '21' : '19'}-inch alloy`],
    ['Tyres (front)', cat === 'sports' ? '245/35 R20' : cat === 'suv' ? '265/45 R21' : '225/50 R19'],
    ['Tyres (rear)', cat === 'sports' ? '295/30 R20' : cat === 'suv' ? '285/40 R21' : '255/45 R19'],
    ['Spare wheel', 'Tyre repair kit + compressor'],
  ];
}

/* ------------------------------------------------------------------ */
/*  Equipment — 30+ items per group, deterministic per car             */
/*  Universal set alone clears 30; tier/category/fuel items extend it. */
/* ------------------------------------------------------------------ */
const LUX = (car) => tier(car) === 'flagship';
const PREM = (car) => tier(car) !== 'core';

const COMFORT_LIBRARY = [
  ['Dual-zone climate control', () => true],
  ['Keyless entry & push-button start', () => true],
  ['Rain-sensing wipers', () => true],
  ['Auto-dimming rear-view mirror', () => true],
  ['Electric parking brake with auto-hold', () => true],
  ['Cruise control', () => true],
  ['Power-adjustable front seats', () => true],
  ['Leather-wrapped steering wheel', () => true],
  ['Power-folding door mirrors', () => true],
  ['Heated door mirrors with kerb view', () => true],
  ['LED headlights with auto levelling', () => true],
  ['Dusk-sensing automatic headlamps', () => true],
  ['LED fog lamps', () => true],
  ['Rear air vents', () => true],
  ['Tilt & telescopic steering column', () => true],
  ['Steering-wheel mounted controls', () => true],
  ['Front centre armrest (sliding)', () => true],
  ['Rear centre armrest with cupholders', () => true],
  ['Split-folding rear seats 60:40', () => true],
  ['Height-adjustable driver seat', () => true],
  ['Illuminated vanity mirrors ×2', () => true],
  ['Overhead console with sunglass holder', () => true],
  ['Carpet floor mats (front + rear)', () => true],
  ['Chrome exterior accents', () => true],
  ['Shark-fin antenna', () => true],
  ['Remote boot release', () => true],
  ['Rear window defroster with timer', () => true],
  ['Two 12 V power outlets', () => true],
  ['Glovebox chiller', () => true],
  ['Rain-sensing automatic wiper mode', () => true],
  ['Ambient LED lighting', PREM],
  ['Wireless phone charging pad', PREM],
  ['Heated front seats', PREM],
  ['Power tailgate', (c) => ['suv', 'sedan', 'luxury'].includes(PRIMARY_CAT(c))],
  ['Panoramic glass roof', (c) => ['suv', 'sedan', 'luxury', 'hybrid'].includes(PRIMARY_CAT(c))],
  ['Sunroof', (c) => PRIMARY_CAT(c) !== 'sports'],
  ['Ventilated front seats', (c) => PREM(c) && ['luxury', 'suv', 'sedan'].includes(PRIMARY_CAT(c))],
  ['Heated rear seats', LUX],
  ['3-zone climate control', (c) => PREM(c) && c.seats >= 5],
  ['4-zone climate control', LUX],
  ['Massage front seats', LUX],
  ['Driver seat memory', (c) => PREM(c) && PRIMARY_CAT(c) !== 'sports'],
  ['Soft-close doors', LUX],
  ['Heated steering wheel', PREM],
  ['Nappa leather upholstery', LUX],
  ['Vegan suede upholstery', (c) => isEv(c) || PRIMARY_CAT(c) === 'sports'],
  ['64-colour ambient themes', LUX],
  ['Rear power sunshades', LUX],
  ['Frameless doors', (c) => ['coupe', 'sports'].includes(PRIMARY_CAT(c)) || isEv(c)],
  ['Privacy glass', (c) => PRIMARY_CAT(c) === 'suv'],
  ['Paddle shifters', (c) => !isEv(c)],
  ['Stainless-steel sport pedals', (c) => ['sports', 'coupe'].includes(PRIMARY_CAT(c))],
  ['One-pedal driving', isEv],
  ['Camp mode (climate stays on)', isEv],
  ['Cabin HEPA filter + ioniser', (c) => LUX(c) || isEv(c)],
  ['Acoustic laminated glass', (c) => PREM(c) && PRIMARY_CAT(c) !== 'sports'],
];

const TECH_LIBRARY = [
  ['Central touchscreen infotainment', () => true],
  ['10.25" digital instrument cluster', () => true],
  ['Wireless Apple CarPlay', () => true],
  ['Wireless Android Auto', () => true],
  ['Built-in satellite navigation', () => true],
  ['Bluetooth with two-phone pairing', () => true],
  ['USB-C fast-charge ports ×4 (45 W)', () => true],
  ['Voice assistant', () => true],
  ['Steering-wheel telematics controls', () => true],
  ['Trip computer with efficiency history', () => true],
  ['Outside temperature gauge', () => true],
  ['Eco-driving performance monitor', () => true],
  ['FM/AM tuner with internet radio', () => true],
  ['Speed-compensated volume', () => true],
  ['Over-the-air map updates', () => true],
  ['Digital radio (DAB+ where available)', () => true],
  ['Rear-seat USB-C ports ×2', () => true],
  ['Customisable home-screen shortcuts', () => true],
  ['Driver profiles (seat, mirror & display memory)', () => true],
  ['Per-wheel tyre-pressure readout', () => true],
  ['Service interval indicator', () => true],
  ['Dual Bluetooth audio streaming', () => true],
  ['Selectable gauge cluster themes', () => true],
  ['Live fuel/energy consumption bar', () => true],
  ['8-speaker audio system', () => true],
  ['Auto-dimming instrument brightness', () => true],
  ['HD Bluetooth audio codecs (aptX/AAC)', () => true],
  ['Firmware updates via USB (fallback)', () => true],
  ["On-screen owner’s manual", () => true],
  ['Radio presets ×24 across bands', () => true],
  ['Secondary 12.3" comfort display', PREM],
  ['Head-up display', (c) => PREM(c) && PRIMARY_CAT(c) !== 'sports'],
  ['Connected car services (LTE)', (c) => isEv(c) || PREM(c)],
  ['Over-the-air software updates', (c) => isEv(c) || PREM(c)],
  ['In-car Wi-Fi hotspot', PREM],
  ['Premium audio system', PREM],
  ['Subwoofer + amplified tweeters', PREM],
  ['360° surround-view camera', (c) => PREM(c) || PRIMARY_CAT(c) === 'suv'],
  ['Digital rear-view mirror', (c) => PRIMARY_CAT(c) === 'suv'],
  ['Smartphone app — climate & lock', (c) => isEv(c) || LUX(c)],
  ['Smartphone app — location & SOS', (c) => isEv(c) || PREM(c)],
  ['Digital key (phone as key)', (c) => isEv(c) || LUX(c)],
  ['AR-enhanced navigation', LUX],
  ['Gesture control', LUX],
  ['Rear-seat entertainment screens', LUX],
  ['Performance recorder with g-meter', (c) => ['sports', 'coupe'].includes(PRIMARY_CAT(c))],
  ['Lap timer + telemetry export', (c) => ['sports', 'coupe'].includes(PRIMARY_CAT(c))],
  ['Live-traffic navigation', PREM],
  ['Dashcam-ready wiring', PREM],
  ['230 V power outlet', (c) => ['suv', 'luxury'].includes(PRIMARY_CAT(c))],
  ['Streaming apps on display', isEv],
  ['Route planner with charging stops', isEv],
  ['Battery pre-heat on navigation', isEv],
  ['Efficiency coach', isEv],
];

const SAFETY_LIBRARY = [
  ['Six airbags (front, side, curtain)', () => true],
  ['ABS with electronic brake-force distribution', () => true],
  ['Electronic stability control', () => true],
  ['Traction control system', () => true],
  ['ISOFIX child-seat anchors (outer rear)', () => true],
  ['Tyre-pressure monitoring system', () => true],
  ['Hill-start assist', () => true],
  ['Rear parking camera with guidelines', () => true],
  ['Rear parking sensors', () => true],
  ['Driver attention monitoring', () => true],
  ['Adjustable speed limiter', () => true],
  ['Immobiliser + perimeter alarm', () => true],
  ['Emergency call system (eCall)', () => true],
  ['Automatic hazard lights on hard braking', () => true],
  ['Seatbelt pretensioners (front)', () => true],
  ['Belt-force limiters (front + rear outer)', () => true],
  ['Three-point belts on all seats', () => true],
  ['Height-adjustable front headrests', () => true],
  ['Rear-door child safety locks', () => true],
  ['Collapsible steering column', () => true],
  ['Front & rear crumple zones', () => true],
  ['Pedestrian-protecting bonnet section', () => true],
  ['First-aid kit + warning triangle', () => true],
  ['Tyre repair kit + compressor', () => true],
  ['LED daytime running lamps', () => true],
  ['Rear fog lamp', () => true],
  ['Speed-sensing door locks', () => true],
  ['Impact-sensing fuel / drive cut-off', () => true],
  ['Seatbelt reminder (all seats)', () => true],
  ['Emergency brake assist (EBA)', () => true],
  ['Anti-whiplash front headrests', () => true],
  ['Autonomous emergency braking (city)', PREM],
  ['AEB — pedestrian & cyclist detection', PREM],
  ['Adaptive cruise control', PREM],
  ['Lane-keeping assist', PREM],
  ['Blind-spot monitoring', PREM],
  ['Rear cross-traffic alert', PREM],
  ['Front parking sensors', PREM],
  ['Traffic-sign recognition', PREM],
  ['Adaptive high-beam assist', PREM],
  ['AEB — intersection assist', (c) => LUX(c) || PRIMARY_CAT(c) === 'luxury'],
  ['Stop-&-go adaptive cruise', (c) => LUX(c) || isEv(c)],
  ['Lane-centering assist', (c) => LUX(c) || isEv(c)],
  ['360° camera', (c) => PREM(c) || PRIMARY_CAT(c) === 'suv'],
  ['Night-vision camera', (c) => LUX(c) && PRIMARY_CAT(c) === 'luxury'],
  ['Hill-descent control', (c) => PRIMARY_CAT(c) === 'suv'],
  ['Trailer-sway assist', (c) => (TOW_BRAKED[PRIMARY_CAT(c)] ?? 0) >= 2000],
  ['Stolen-vehicle tracking', LUX],
  ['Dashcam integration', (c) => isEv(c) || LUX(c)],
  ['Reinforced battery enclosure', isEv],
];

const collect = (library, car, cap = 34) => library.filter(([, ok]) => ok(car)).map(([item]) => item).slice(0, cap);

export const buildComfortFeatures = (car) => collect(COMFORT_LIBRARY, car);
export const buildTechFeatures = (car) => collect(TECH_LIBRARY, car);
export const buildSafetyFeatures = (car) => collect(SAFETY_LIBRARY, car);
