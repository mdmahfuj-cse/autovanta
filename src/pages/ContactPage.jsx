import { useState } from 'react';
import { Check, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { SHOWROOMS, FLAGSHIP_SHOWROOM } from '../data/index.js';
import { validateContact, CONTACT_TOPICS } from '../utils/validateContact.js';
import { toast } from '../stores/toastStore.js';
import { cn } from '../utils/cn.js';

const EMPTY_FORM = { name: '', contact: '', topic: '', message: '' };

function ShowroomCard({ showroom, large = false }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-white/8 bg-base-200', large && 'border-white/12')}>
      {large && showroom.image && (
        <div className="relative aspect-[16/7]">
          <img src={showroom.image} alt={`${showroom.name} exterior`} className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-base-200 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold tracking-tight">{showroom.name}</h3>
          {showroom.flagship && (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              Flagship
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-2.5 text-sm text-muted">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {showroom.address}
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
            <a href={`tel:${showroom.phone.replace(/\s/g, '')}`} className="font-mono transition-colors hover:text-base-content">
              {showroom.phone}
            </a>
          </li>
          <li className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            <a href={`mailto:${showroom.email}`} className="transition-colors hover:text-base-content">
              {showroom.email}
            </a>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Sat–Thu {showroom.hours.satToThu}
              <br />
              Fri {showroom.hours.friday}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function ContactPage() {
  useDocumentTitle('Contact');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const setField = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    if (Object.keys(errors).length) setErrors(validateContact(next).errors);
    if (sent) setSent(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const result = validateContact(form);
    setErrors(result.errors);
    if (!result.valid) return;
    setSent(true);
    setForm(EMPTY_FORM);
    toast({
      title: 'Message sent',
      description: "We'll get back to you within one business hour.",
      variant: 'success',
    });
  };

  const inputClass = (field) =>
    cn(
      'w-full rounded-lg border bg-base-100 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted',
      errors[field] ? 'border-error/60 focus-visible:border-error' : 'border-white/12 focus-visible:border-primary/50'
    );

  return (
    <PageTransition>
      {/* Header band */}
      <section className="border-b border-white/8 bg-base-200/40 pb-10 pt-32 lg:pb-12 lg:pt-36">
        <div className="container-x">
          <p className="text-eyebrow flex items-center gap-2.5 text-muted">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-primary" />
            Contact · 3 showrooms
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Find us on <span className="text-secondary">the floor</span>.
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            Call ahead or just walk in — the coffee machine is on and nobody works on commission.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Showrooms */}
        <div className="space-y-5">
          {SHOWROOMS.map((showroom, i) => (
            <Reveal key={showroom.id} delay={i * 0.06}>
              <ShowroomCard showroom={showroom} large={showroom.flagship} />
            </Reveal>
          ))}
        </div>

        {/* Message form */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-white/10 bg-base-200 p-6 md:p-8 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl font-bold tracking-tight">Send a message</h2>
            <p className="mt-1.5 text-sm text-muted">
              Sales, service or finance — it lands in the right inbox automatically.
            </p>

            {sent && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>
                  Message received — <span className="font-medium">Rahim</span> or{' '}
                  <span className="font-medium">Mim</span> will reply within one business hour.
                </span>
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
              <div>
                <label htmlFor="ct-name" className="text-sm font-medium">
                  Your name
                </label>
                <input
                  id="ct-name"
                  type="text"
                  value={form.name}
                  onChange={setField('name')}
                  placeholder="e.g. Imran Hossain"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'ct-name-err' : undefined}
                  className={cn(inputClass('name'), 'mt-2.5')}
                />
                {errors.name && (
                  <p id="ct-name-err" className="mt-1.5 text-xs text-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ct-contact" className="text-sm font-medium">
                  Email or mobile
                </label>
                <input
                  id="ct-contact"
                  type="text"
                  value={form.contact}
                  onChange={setField('contact')}
                  placeholder="01712 345 678 or you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? 'ct-contact-err' : undefined}
                  className={cn(inputClass('contact'), 'mt-2.5')}
                />
                {errors.contact && (
                  <p id="ct-contact-err" className="mt-1.5 text-xs text-error">
                    {errors.contact}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ct-topic" className="text-sm font-medium">
                  Topic
                </label>
                <select
                  id="ct-topic"
                  value={form.topic}
                  onChange={setField('topic')}
                  aria-invalid={Boolean(errors.topic)}
                  aria-describedby={errors.topic ? 'ct-topic-err' : undefined}
                  className={cn(inputClass('topic'), 'mt-2.5 appearance-none')}
                >
                  <option value="">Choose a topic…</option>
                  {CONTACT_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.topic && (
                  <p id="ct-topic-err" className="mt-1.5 text-xs text-error">
                    {errors.topic}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="ct-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="ct-message"
                  rows={5}
                  value={form.message}
                  onChange={setField('message')}
                  placeholder="What can we help with? Mention any vehicle you have your eye on."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'ct-message-err' : undefined}
                  className={cn(inputClass('message'), 'mt-2.5 resize-y')}
                />
                {errors.message && (
                  <p id="ct-message-err" className="mt-1.5 text-xs text-error">
                    {errors.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-md w-full rounded-md font-display tracking-wide">
                <Send className="h-4 w-4" aria-hidden="true" /> Send message
              </button>
              <p className="text-center text-xs text-muted">
                Or call the flagship directly ·{' '}
                <a href={`tel:${FLAGSHIP_SHOWROOM.phone.replace(/\s/g, '')}`} className="font-mono text-base-content transition-colors hover:text-primary-text">
                  {FLAGSHIP_SHOWROOM.phone}
                </a>
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
