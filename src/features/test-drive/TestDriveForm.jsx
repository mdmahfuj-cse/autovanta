import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { bookingSchema, BOOKING_DEFAULTS, isoToday } from './bookingSchema.js';
import { CARS, BRANDS_BY_ID, SHOWROOMS } from '../../data/index.js';
import { useBookingStore, slotsForDate, TIME_SLOTS } from '../../stores/bookingStore.js';
import { toast } from '../../stores/toastStore.js';
import { cn } from '../../utils/cn.js';

const isoMax = () => {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Test-drive booking form — React Hook Form + Zod.
 * Values are validated client-side and persisted through bookingStore.
 */
export default function TestDriveForm({ prefillCarId = '', onBooked }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { ...BOOKING_DEFAULTS, carId: prefillCarId },
  });

  const [dateValue, setDateValue] = useState('');
  const slots = slotsForDate(dateValue);
  const isFriday = slots.length < TIME_SLOTS.length;

  const dateField = register('date');
  const onSubmit = handleSubmit((values) => {
    const car = CARS.find((c) => c.id === values.carId);
    const showroom = SHOWROOMS.find((s) => s.id === values.showroomId);
    const saved = useBookingStore.getState().add({
      ...values,
      carLabel: `${BRANDS_BY_ID[car.brandId]?.name ?? ''} ${car.model} ${car.trim}`.trim(),
      showroomLabel: showroom.name,
    });
    toast({
      title: 'Test drive booked',
      description: `${saved.ref} · ${values.date} at ${values.time}`,
      variant: 'success',
    });
    reset({ ...BOOKING_DEFAULTS, carId: prefillCarId });
    onBooked?.({ ...saved, ...values, carLabel: `${BRANDS_BY_ID[car.brandId]?.name ?? ''} ${car.model} ${car.trim}`.trim(), showroomLabel: showroom.name });
  });

  const err = (name) => errors[name]?.message;
  const invalid = (name) => Boolean(errors[name]);

  const inputClass = (name) =>
    cn(
      'w-full rounded-lg border bg-base-100 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted',
      invalid(name) ? 'border-error/60 focus-visible:border-error' : 'border-white/12 focus-visible:border-primary/50'
    );

  const fieldError = (name) =>
    err(name) ? (
      <p key={`${name}-err`} id={`${name}-err`} role="alert" className="mt-1.5 text-xs text-error">
        {err(name)}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="td-name" className="text-sm font-medium">Full name</label>
        <input
          id="td-name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Imran Hossain"
          aria-invalid={invalid('name')}
          aria-describedby={err('name') ? 'name-err' : undefined}
          className={cn(inputClass('name'), 'mt-2.5')}
          {...register('name')}
        />
        {fieldError("name")}
      </div>

      <div>
        <label htmlFor="td-contact" className="text-sm font-medium">Email or mobile</label>
        <input
          id="td-contact"
          type="text"
          autoComplete="email"
          placeholder="01712 345 678 or you@example.com"
          aria-invalid={invalid('contact')}
          aria-describedby={err('contact') ? 'contact-err' : undefined}
          className={cn(inputClass('contact'), 'mt-2.5')}
          {...register('contact')}
        />
        {fieldError("contact")}
      </div>

      <div>
        <label htmlFor="td-car" className="text-sm font-medium">Vehicle</label>
        <select
          id="td-car"
          aria-invalid={invalid('carId')}
          aria-describedby={err('carId') ? 'carId-err' : undefined}
          className={cn(inputClass('carId'), 'mt-2.5 appearance-none')}
          {...register('carId')}
        >
          <option value="">Choose a machine…</option>
          {CARS.map((car) => (
            <option key={car.id} value={car.id}>
              {BRANDS_BY_ID[car.brandId]?.name} {car.model} {car.trim}
            </option>
          ))}
        </select>
        {fieldError("carId")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="td-date" className="text-sm font-medium">Preferred date</label>
          <input
            id="td-date"
            type="date"
            min={isoToday()}
            max={isoMax()}
            aria-invalid={invalid('date')}
            aria-describedby={err('date') ? 'date-err' : undefined}
            className={cn(inputClass('date'), 'mt-2.5')}
            {...dateField}
            onChange={(e) => {
              dateField.onChange(e);
              setDateValue(e.target.value);
              setValue('time', '');
            }}
          />
          {fieldError("date")}
        </div>

        <div>
          <label htmlFor="td-time" className="text-sm font-medium">Preferred time</label>
          <select
            id="td-time"
            aria-invalid={invalid('time')}
            aria-describedby={err('time') ? 'time-err' : undefined}
            className={cn(inputClass('time'), 'mt-2.5 appearance-none')}
            {...register('time')}
          >
            <option value="">Choose a slot…</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {isFriday && !err('time') && (
            <p className="mt-1.5 text-xs text-muted">Friday hours — slots from 15:00 only.</p>
          )}
          {fieldError("time")}
        </div>
      </div>

      <div>
        <label htmlFor="td-showroom" className="text-sm font-medium">Showroom</label>
        <select
          id="td-showroom"
          aria-invalid={invalid('showroomId')}
          aria-describedby={err('showroomId') ? 'showroomId-err' : undefined}
          className={cn(inputClass('showroomId'), 'mt-2.5 appearance-none')}
          {...register('showroomId')}
        >
          <option value="">Choose a showroom…</option>
          {SHOWROOMS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.city}
            </option>
          ))}
        </select>
        {fieldError("showroomId")}
      </div>

      <div>
        <label htmlFor="td-notes" className="text-sm font-medium">
          Notes <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="td-notes"
          rows={3}
          placeholder="Trade-in? Specific route? Let us know."
          aria-invalid={invalid('notes')}
          aria-describedby={err('notes') ? 'notes-err' : undefined}
          className={cn(inputClass('notes'), 'mt-2.5 resize-y')}
          {...register('notes')}
        />
        {fieldError("notes")}
      </div>

      <button type="submit" className="btn btn-primary btn-md w-full rounded-md font-display tracking-wide">
        <KeyRound className="h-4.5 w-4.5" aria-hidden="true" /> Confirm test drive
      </button>
      <p className="text-center text-xs text-muted">Free · 30 minutes · bring your driving license</p>
    </form>
  );
}
