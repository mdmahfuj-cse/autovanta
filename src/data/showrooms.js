import showroomImage from '../assets/showroom/showroom-gec.jpg';

/** AutoVanta showroom network — Chattogram GEC is the flagship. */
export const SHOWROOMS = [
  {
    id: 'gulshan',
    name: 'AutoVanta Gulshan',
    city: 'Dhaka',
    address: 'Plot 42, Bir Uttam Mir Shawkat Sarak, Gulshan 2, Dhaka 1212',
    phone: '+880 17 1234 0001',
    email: 'gulshan@autovanta.example',
    hours: { satToThu: '9:00 – 20:00', friday: '15:00 – 20:00' },
    flagship: false,
    image: null,
  },
  {
    id: 'gec-chattogram',
    name: 'AutoVanta GEC',
    city: 'Chattogram',
    address: 'Zakir Hossain Road, GEC Circle, Khulshi, Chattogram 4210',
    phone: '+880 18 1234 5678',
    email: 'gec@autovanta.example',
    hours: { satToThu: '9:00 – 20:00', friday: '15:00 – 20:00' },
    flagship: true,
    image: showroomImage,
  },
  {
    id: 'zindabazar-sylhet',
    name: 'AutoVanta Sylhet',
    city: 'Sylhet',
    address: 'Kazir Bazar Road, Zindabazar, Sylhet 3100',
    phone: '+880 19 1234 0003',
    email: 'sylhet@autovanta.example',
    hours: { satToThu: '9:00 – 19:00', friday: '15:00 – 19:00' },
    flagship: false,
    image: null,
  },
];

export const FLAGSHIP_SHOWROOM = SHOWROOMS.find((s) => s.flagship);
