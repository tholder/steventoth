import type { APIRoute } from 'astro';
import { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } from 'astro:env/server';
import { areas, intents } from '../../data/form';

export const prerender = false;

const MIN_FILL_MS = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const clean = (v: FormDataEntryValue | null, max = 500) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

const cleanAll = (form: FormData, key: string) =>
  form
    .getAll(key)
    .map((v) => clean(v, 200))
    .filter(Boolean);

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  const fail = (error: string, status = 400) =>
    wantsJson
      ? Response.json({ ok: false, error }, { status })
      : redirect(`/contact?error=${encodeURIComponent(error)}`, 303);
  const succeed = () => (wantsJson ? Response.json({ ok: true }) : redirect('/contact/thanks', 303));

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Invalid submission.');
  }

  // Spam traps: hidden honeypot field, and submissions faster than a human could type.
  if (clean(form.get('company_website'))) return succeed();
  const startedAt = Number(clean(form.get('started_at')));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return succeed();

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const intentValue = clean(form.get('intent'), 20);
  const consent = clean(form.get('consent')) === 'yes';

  if (!name) return fail('Please enter your name.');
  if (!EMAIL_RE.test(email)) return fail('Please enter a valid email address.');
  if (!intentValue) return fail('Please tell me whether you’re buying, selling or exploring.');
  if (!consent) return fail('Please confirm you’re happy to be contacted.');

  const intent = intents.find((i) => i.value === intentValue)?.label ?? intentValue;
  const areaLabels = cleanAll(form, 'areas').map((v) => areas.find((a) => a.value === v)?.label ?? v);
  const priceMin = clean(form.get('price_min'), 20);
  const priceMax = clean(form.get('price_max'), 20);
  const price = priceMin || priceMax ? `${priceMin || 'No min'} – ${priceMax || 'No max'}` : '';

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone', clean(form.get('phone'), 40)],
    ['Preferred contact', clean(form.get('contact_method'), 40)],
    ['Looking to', intent],
    ['Timeline', clean(form.get('timeline'), 60)],
    ['Property types', cleanAll(form, 'property_types').join(', ')],
    ['Price range', price],
    ['Bedrooms', clean(form.get('bedrooms'), 20)],
    ['Bathrooms', clean(form.get('bathrooms'), 20)],
    ['Neighbourhoods', areaLabels.join(', ')],
    ['Must-haves', cleanAll(form, 'must_haves').join(', ')],
    ['Financing', clean(form.get('financing'), 40)],
    ['Selling: address', clean(form.get('sell_address'), 200)],
    ['Selling: type', clean(form.get('sell_type'), 60)],
    ['Message', clean(form.get('message'), 5000)],
  ];
  const filled = rows.filter(([, v]) => v);

  const text = filled.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#102a3a;max-width:640px">
      <h2 style="margin:0 0 16px;font-family:Georgia,serif">New enquiry from steventoth.ca</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:15px">
        ${filled
          .map(
            ([k, v]) => `<tr>
              <td style="border-bottom:1px solid #eee;font-weight:600;white-space:nowrap;vertical-align:top;width:160px">${escapeHtml(k)}</td>
              <td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(v)}</td>
            </tr>`,
          )
          .join('')}
      </table>
      <p style="margin-top:20px;font-size:13px;color:#667">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
    </div>`;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('Contact form is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.');
    console.info(`Unsent enquiry:\n${text}`);
    return fail('The contact form isn’t set up yet.', 503);
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `Website enquiry: ${intent} – ${name}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return fail('Sorry, your message couldn’t be sent.', 502);
  }

  return succeed();
};

export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
