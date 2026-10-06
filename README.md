# steventoth.ca

Website for Steven Toth, a Kitsilano-based REALTOR® with Macdonald Realty. Built with [Astro](https://astro.build) and deployed on Vercel.

- Static pages for speed, plus one serverless function (`/api/contact`) for the contact form
- SEO: per-page titles and descriptions, canonical URLs, Open Graph image, `sitemap-index.xml`, `robots.txt`, and JSON-LD (RealEstateAgent, Person, FAQ, HowTo, Breadcrumb)
- Responsive AVIF/WebP headshot, self-hosted variable fonts, almost no client JS
- 301 redirects from the old Ubertor URLs (`/AboutMe.ubr`, `/index.php`, …) in `vercel.json`

## Develop

Requires Node 22.12+.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run check    # type-check
```

## Deploy to Vercel

1. Import this repo in Vercel. The framework preset (Astro) is detected automatically.
2. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Example | Notes |
   | --- | --- | --- |
   | `RESEND_API_KEY` | `re_…` | Create one at [resend.com](https://resend.com) (free tier is plenty) |
   | `CONTACT_TO_EMAIL` | `steven@example.com` | Where enquiries go. Comma-separate multiple addresses |
   | `CONTACT_FROM_EMAIL` | `Steven Toth Website <hello@steventoth.ca>` | Must be on a domain verified in Resend. Until it's verified, the default `onboarding@resend.dev` only delivers to the Resend account owner's email |

3. Add the domains `steventoth.ca` and `www.steventoth.ca` in Vercel, with `www` as the primary, and update DNS.

Without the email variables the form shows a friendly "not set up yet" message and logs the enquiry to the function logs.

## Editing content

- Contact details, brokerage and social links: `src/data/site.ts`
- Neighbourhood guides: `src/data/neighbourhoods.ts` (each entry generates a page at `/neighbourhoods/<slug>`)
- Contact form options (price ranges, must-haves, …): `src/data/form.ts`
- Pages: `src/pages/`
