import { getCollection, type CollectionEntry } from 'astro:content';
import { neighbourhoods } from '../data/neighbourhoods';

export type Property = CollectionEntry<'properties'>;

export const statusLabel: Record<Property['data']['status'], string> = {
  'for-sale': 'For sale',
  'coming-soon': 'Coming soon',
  sold: 'Sold',
  leased: 'Leased',
};

export const isActive = (p: Property) => p.data.status === 'for-sale' || p.data.status === 'coming-soon';

/** All properties: active listings first, then most recent. */
export async function getProperties() {
  const all = await getCollection('properties');
  return all.sort(
    (a, b) => Number(isActive(b)) - Number(isActive(a)) || b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export const neighbourhoodFor = (name: string) => {
  const key = name.trim().toLowerCase();
  return neighbourhoods.find((n) => n.name.toLowerCase() === key || n.slug === key);
};
