import { z } from 'zod';

const BD_PHONE = /^(\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isoToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isoMax = () => {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Test-drive booking schema — shared by the form and tests. */
export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.'),
  contact: z
    .string()
    .trim()
    .min(1, 'We need an email or mobile to confirm your slot.')
    .refine((v) => BD_PHONE.test(v) || EMAIL.test(v), 'Enter a valid email address or BD mobile number (e.g. 01712 345 678).'),
  carId: z.string().min(1, 'Pick the machine you want to drive.'),
  date: z
    .string()
    .min(1, 'Choose a date.')
    .refine((v) => v >= isoToday(), 'That date is in the past — pick today or later.')
    .refine((v) => v <= isoMax(), 'Bookings open up to 90 days ahead.'),
  time: z.string().min(1, 'Pick a time slot.'),
  showroomId: z.string().min(1, 'Choose a showroom.'),
  notes: z.string().max(300, 'Keep notes under 300 characters.').optional().or(z.literal('')),
});

export const BOOKING_DEFAULTS = {
  name: '',
  contact: '',
  carId: '',
  date: '',
  time: '',
  showroomId: '',
  notes: '',
};
