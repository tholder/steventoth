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

## Adding properties

The **Properties** page (`/properties`) and the "Recent properties" strip on the homepage come from Markdown files in `src/content/properties/`. Until there's at least one, the page shows a "new listings on the way" message and the homepage strip is hidden.

1. Copy `src/content/properties/_template.md` to a new file such as `2150-west-3rd-ave.md`. The file name becomes the URL.
2. Fill in the details and put photos in `src/content/properties/photos/`. They're resized and converted to AVIF/WebP automatically.
3. Optionally set `externalUrl` to the full listing on REALTOR.ca, Zealty, etc.
4. Commit and push. Vercel redeploys automatically.

Only post photos and descriptions Steven has the rights to use: his own listings, with his brokerage's and seller's consent. Use `showPrice: false` for sold prices you don't have permission to publish.

> **Why not pull listings from Zealty?** Zealty's terms prohibit scraping, extracting or redistributing listing data, and it's MLS® data owned by the boards. The legitimate way to automate this is a licensed feed: CREA's **DDF®** (free for REALTOR® members, covers Steven's own or his brokerage's listings) or a board-approved IDX provider through Macdonald Realty. Either can be wired into the same `properties` collection later with an Astro content loader.

## Intro video

The homepage "Meet Steven" video (`public/video/`) is generated from `video/intro.html`, an animated HTML timeline using the site's fonts, colours and headshot. Open that file in a browser to preview it live. To edit the text or timing and re-export the MP4, WebM and poster:

```bash
npm i --no-save playwright ffmpeg-static
npx playwright install chromium
node video/render.mjs
```

It's silent (so it can autoplay muted), plays only while on screen, has a pause button, and won't autoplay for visitors who prefer reduced motion. If Steven records a real talking-head clip later, drop it in `public/video/` with the same file names.

## Editing content

- Contact details, brokerage and social links: `src/data/site.ts`
- Neighbourhood guides: `src/data/neighbourhoods.ts` (each entry generates a page at `/neighbourhoods/<slug>`)
- Contact form options (price ranges, must-haves, …): `src/data/form.ts`
- Pages: `src/pages/`
