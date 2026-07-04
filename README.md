# Enoch's Dedication — Guest Invitation System

A web app that generates a unique, permanent invitation page + live PDF for
each of your 109 guests. If a table changes, the guest's link stays the
same but the content (table number, PDF, QR code) updates instantly —
no re-sending links, no re-uploading files.

---

## What's included

- **109 guests pre-seeded** from your guest list, across **15 tables**
  (plus overflow tables 16, 17, 18 for walk-ins)
- **8 rotating design variants** — same overall theme, different accent
  color/ornament per table so nearby tables feel distinct but cohesive
- **Guest-facing page** (`/invite/:slug`) — shows name, table, event
  details, a QR code, and a "Download PDF" button
- **Live PDF generation** — the PDF is built fresh every time it's
  requested, straight from the current database state
- **Admin dashboard** (`/admin`) — login-protected guest table editor
- **Seating Directory** (`/admin/seating-directory`) — admin-only page
  that shuffles table order AND guest names within each table on every
  reload, with a "Download PDF" button to snapshot the current shuffle

---

## Project structure

```
enoch-invites/
├── supabase/
│   ├── schema.sql       ← run this first in Supabase SQL editor
│   └── seed.sql         ← your 109 guests + table/design mapping
├── server/              ← Express API (PDF generation, admin routes)
│   ├── routes/
│   ├── templates/
│   └── index.js
├── client/              ← React + Vite frontend
│   └── src/
│       ├── pages/
│       └── lib/
└── guests_parsed.json   ← raw parsed guest data (reference only)
```

---

## Setup — step by step

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a new project, and note:
- Project URL
- `anon` public key
- `service_role` secret key (Settings → API)

### 2. Run the database schema
In the Supabase SQL Editor, run `supabase/schema.sql` first, then
`supabase/seed.sql`. This creates all tables and inserts your 109 guests.

### 3. Create your admin login
In Supabase → Authentication → Users → Add User, create yourself an
account (email + password). This is what you'll use to log into `/admin`.

### 4. Configure the server
```bash
cd server
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PUBLIC_SITE_URL
npm install
npm run dev
```
Server runs on `http://localhost:4000`.

### 5. Configure the client
```bash
cd client
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

### 6. Try it out
- Visit `http://localhost:5173/admin`, log in
- Go to Guest Management, see all 109 guests, try changing a table number
- Visit `http://localhost:5173/invite/<any-slug-from-the-admin-table>`
  to see that guest's invitation page and download their PDF
- Change their table number in admin, refresh the invite page — it
  updates instantly, same link

---

## How to reassign a table

1. Log into `/admin`
2. Find the guest in the table
3. Edit the number in the "Table" column, click away to save
4. Their invitation link and QR code do not change — the next time
   anyone opens or downloads it, it reflects the new table automatically

---

## Sharing invitations with guests

Each guest's permanent link is:
```
https://your-site.com/invite/<their-slug>
```
You can find every guest's slug in the Admin → Guest Management table.
Share via WhatsApp, SMS, or email — whichever you used to collect RSVPs.
The QR code on their page also encodes this same link, so it can be
printed or screenshotted.

---

## Deployment notes

- **Server**: needs a Node host that supports Puppeteer/Chromium
  (e.g. Railway, Render, Fly.io — plain serverless functions like Vercel
  need extra Chromium binary configuration, so a small VM/container host
  is simpler for this use case)
- **Client**: any static host (Vercel, Netlify, Cloudflare Pages)
- Update `PUBLIC_SITE_URL` in the server `.env` to your real deployed
  client URL once live, so QR codes point to the correct place

---

## Design variants reference

| Table | Variant | Accent |
|---|---|---|
| 1, 9, 17 | Dusty Blue | `#7a9aaa` |
| 2, 10, 18 | Sage Green | `#8aa88a` |
| 3, 11 | Powder Blue | `#9cb8cc` |
| 4, 12 | Soft Teal | `#6fa3a0` |
| 5, 13 | Warm Sand | `#c2a877` |
| 6, 14 | Muted Lilac | `#a89cc8` |
| 7, 15 | Sky Mist | `#8fb4c9` |
| 8, 16 | Antique Rose | `#c49a9a` |

To change these, edit `design_variants` directly in Supabase, or
adjust `supabase/seed.sql` before running it.
