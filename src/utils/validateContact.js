/**
 * Contact-form validation — pure function, unit-testable.
 * Accepts a Bangladeshi phone number OR an email in the `contact` field.
 */

const BD_PHONE = /^(\+8801|8801|01)[3-9]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const CONTACT_TOPICS = ['Buying a car', 'Service & maintenance', 'Finance & insurance', 'Something else'];

export function validateContact({ name = '', contact = '', topic = '', message = '' }) {
  const errors = {
    ...(name.trim().length < 2 ? { name: 'Please tell us your name.' } : {}),
    ...(BD_PHONE.test(contact.trim()) || EMAIL.test(contact.trim())
      ? {}
      : { contact: 'Enter a valid email address or BD mobile number (e.g. 01712 345 678).' }),
    ...(topic ? {} : { topic: 'Pick a topic so we can route you correctly.' }),
    ...(message.trim().length < 10 ? { message: 'Give us a little more detail — at least 10 characters.' } : {}),
  };

  return { valid: Object.keys(errors).length === 0, errors };
}
