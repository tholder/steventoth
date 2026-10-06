import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const properties = defineCollection({
  // Files starting with "_" (like the template) are ignored.
  loader: glob({ base: './src/content/properties', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      address: z.string(),
      neighbourhood: z.string(),
      status: z.enum(['for-sale', 'coming-soon', 'sold', 'leased']),
      date: z.coerce.date(),
      type: z.string(),
      price: z.number().optional(),
      showPrice: z.boolean().default(true),
      beds: z.number().optional(),
      baths: z.number().optional(),
      sqft: z.number().optional(),
      mlsNumber: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      gallery: z.array(image()).default([]),
      externalUrl: z.url().optional(),
      externalLabel: z.string().default('View full listing'),
      featured: z.boolean().default(false),
    }),
});

export const collections = { properties };
