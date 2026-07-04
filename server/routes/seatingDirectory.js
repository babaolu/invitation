import express from 'express';
import puppeteer from 'puppeteer';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function buildShuffledDirectory() {
  const { data: guests } = await supabase
    .from('guests')
    .select('id, full_name, table_number')
    .order('table_number');

  const grouped = {};
  for (const g of guests) {
    if (!grouped[g.table_number]) grouped[g.table_number] = [];
    grouped[g.table_number].push({ id: g.id, full_name: g.full_name, table_number: g.table_number });
  }

  // Shuffle table order
  const tableNumbers = shuffle(Object.keys(grouped).map(Number));

  // Shuffle names within each table
  const result = tableNumbers.map((tableNum) => ({
    tableNumber: tableNum,
    guests: shuffle(grouped[tableNum]),
  }));

  return result;
}

// GET /api/admin/seating-directory — requires the admin's Supabase auth token
// (verified on the frontend via Supabase Auth; this endpoint additionally
// checks the Authorization header before returning data)
router.get('/api/admin/seating-directory', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData?.user) return res.status(401).json({ error: 'Unauthorized' });

  const directory = await buildShuffledDirectory();
  res.json({ directory });
});

// GET /api/admin/seating-directory/pdf — snapshot the current shuffle as a PDF
router.get('/api/admin/seating-directory/pdf', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Unauthorized');

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData?.user) return res.status(401).send('Unauthorized');

  const directory = await buildShuffledDirectory();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Quicksand:wght@300;400;500&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Quicksand', sans-serif;
      padding: 16mm 14mm;
      background: #ffffff;
    }
    h1 {
      font-family: 'Cormorant Garamond', serif;
      font-size: 30px;
      font-weight: 300;
      font-style: italic;
      text-align: center;
      color: #2e3a40;
      margin-bottom: 4px;
    }
    .subtitle {
      text-align: center;
      font-size: 10px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #7a9aaa;
      margin-bottom: 24px;
    }
    .grid {
      column-count: 3;
      column-gap: 14px;
    }
    .table-block {
      break-inside: avoid;
      border: 1px solid #ddeaf0;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 12px;
      background: #fbfaf6;
    }
    .table-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 16px;
      color: #2e3a40;
      margin-bottom: 6px;
      border-bottom: 1px solid #ddeaf0;
      padding-bottom: 4px;
    }
    .guest-item {
      font-size: 10px;
      color: #4a6070;
      padding: 2px 0;
    }
  </style>
  </head>
  <body>
    <h1>Seating Directory</h1>
    <div class="subtitle">Enoch's Dedication — Internal Reference</div>
    <div class="grid">
      ${directory.map(t => `
        <div class="table-block">
          <div class="table-title">Table ${t.tableNumber}</div>
          ${t.guests.map(g => `<div class="guest-item">${escapeHtml(g.full_name)}</div>`).join('')}
        </div>
      `).join('')}
    </div>
  </body>
  </html>
  `;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  });
  await page.close();
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="seating-directory.pdf"',
  });
  res.send(pdfBuffer);
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default router;
