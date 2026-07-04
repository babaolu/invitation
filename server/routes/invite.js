import express from 'express';
import QRCode from 'qrcode';
import puppeteer from 'puppeteer';
import { supabase } from '../supabaseClient.js';
import { renderInvitationHTML } from '../templates/invitationTemplate.js';

const router = express.Router();

// Reuse a single browser instance across requests for speed,
// instead of launching Chromium fresh on every PDF download.
let browserInstance = null;
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }
  return browserInstance;
}

async function fetchGuestWithVariant(slug) {
  const { data: guest, error } = await supabase
    .from('guests')
    .select('id, full_name, table_number, slug')
    .eq('slug', slug)
    .single();

  if (error || !guest) return null;

  const { data: tableRow } = await supabase
    .from('event_tables')
    .select('table_number, design_variant_id, design_variants(*)')
    .eq('table_number', guest.table_number)
    .single();

  const variant = tableRow?.design_variants || {
    accent_color: '#7a9aaa',
    accent_light: '#ddeaf0',
    ornament: 'floral',
  };

  return { guest, variant };
}

// GET /api/invite/:slug — fetch current guest info (for the React page to display)
router.get('/api/invite/:slug', async (req, res) => {
  const result = await fetchGuestWithVariant(req.params.slug);
  if (!result) return res.status(404).json({ error: 'Invitation not found' });

  res.json({
    fullName: result.guest.full_name,
    tableNumber: result.guest.table_number,
    accentColor: result.variant.accent_color,
    accentLight: result.variant.accent_light,
    ornament: result.variant.ornament,
  });
});

// GET /api/invite/:slug/pdf — live-generate the PDF, always reflecting
// current table assignment. This is the link guests download/re-download.
router.get('/api/invite/:slug/pdf', async (req, res) => {
  const result = await fetchGuestWithVariant(req.params.slug);
  if (!result) return res.status(404).send('Invitation not found');

  const { guest, variant } = result;

  // Generate a QR code that points back to this same guest page
  const inviteUrl = `${process.env.PUBLIC_SITE_URL}/invite/${guest.slug}`;
  const qrDataUrl = await QRCode.toDataURL(inviteUrl, { margin: 1, width: 200 });

  const html = renderInvitationHTML({
    fullName: guest.full_name,
    tableNumber: guest.table_number,
    variant,
    qrDataUrl,
  });

  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    width: '148mm',
    height: '210mm',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  await page.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `inline; filename="Enoch-Dedication-Invite-${guest.full_name.replace(/\s+/g, '-')}.pdf"`,
  });
  res.send(pdfBuffer);
});

export default router;
