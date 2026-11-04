# AurentDev Studio — Vercel

## Deploy

Upload the whole project directory (including `api/contact.js`) to Vercel, or run `vercel --prod` from this directory. Do **not** deploy `index.html` alone: the form requires the API endpoint.

## Contact form (Resend)

In Vercel → Project → Settings → Environment Variables, configure:

- `RESEND_API_KEY`: your Resend API key
- `CONTACT_TO_EMAIL`: mailbox receiving inquiries (your real email)
- `CONTACT_FROM_EMAIL`: verified sender address on your domain, e.g. `AurentDev <web@your-verified-domain.com>`

Resend requires verifying the sending domain. Without these three variables, the form displays a helpful error and does not claim a message was sent. Redeploy after adding variables. For testing without a verified domain, use Resend's documented test sending restrictions; do not use the test sender for public production submissions.

WhatsApp button opens +51 915 167 773 with a prefilled inquiry.

Security note: before publicly promoting the site, add rate limiting and anti-spam protection (e.g. Turnstile) to the API endpoint.
