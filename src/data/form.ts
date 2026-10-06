import { neighbourhoods } from './neighbourhoods';

export const intents = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'buy-sell', label: 'Buy & sell' },
  { value: 'invest', label: 'Invest' },
  { value: 'explore', label: 'Just exploring' },
];

export const timelines = ['As soon as possible', '1–3 months', '3–6 months', '6–12 months', '12+ months', 'Not sure yet'];

export const propertyTypes = [
  'Condo / apartment',
  'Townhouse',
  'Detached house',
  'Character / heritage home',
  'Duplex / half-duplex',
  'Multi-unit / investment',
];

export const bedrooms = ['Studio', '1+', '2+', '3+', '4+', '5+'];
export const bathrooms = ['1+', '2+', '3+', '4+'];

export const prices = [
  '$500K',
  '$750K',
  '$1M',
  '$1.25M',
  '$1.5M',
  '$2M',
  '$2.5M',
  '$3M',
  '$4M',
  '$5M',
  '$7.5M+',
];

export const areas = [
  ...neighbourhoods.map((n) => ({ value: n.slug, label: n.name })),
  { value: 'elsewhere', label: 'Elsewhere in Metro Vancouver' },
];

export const mustHaves = [
  'Parking',
  'Outdoor space / yard',
  'Pet-friendly',
  'Near good schools',
  'Close to transit',
  'Water or mountain view',
  'Home office',
  'Mortgage helper / suite',
  'In-suite laundry',
  'Walk to beach',
  'Move-in ready',
  'Renovation potential',
];

export const financing = ['Pre-approved', 'Working on it', 'Not yet', 'Paying cash'];

export const contactMethods = ['Email', 'Phone call', 'Text message'];
