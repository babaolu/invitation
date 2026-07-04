// Generates the HTML for a single guest's invitation card.
// Same overall theme for everyone; the accent color/ornament
// changes per table via the design variant passed in.

const CORNER_SVG = `
<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; fill: none;">
  <!-- Main outer leafy flourishes -->
  <path d="M 0 0 C 30 10, 55 20, 65 45 C 48 40, 28 25, 0 0 Z" fill="var(--accent)" fill-opacity="0.1" stroke="var(--accent)" stroke-width="1.1"></path>
  <path d="M 0 0 C 10 30, 20 55, 45 65 C 40 48, 25 28, 0 0 Z" fill="var(--accent)" fill-opacity="0.1" stroke="var(--accent)" stroke-width="1.1"></path>
  <!-- Extended delicate line sprigs -->
  <path d="M 0 0 Q 40 18, 75 75" fill="none" stroke="var(--accent)" stroke-width="1.0" stroke-linecap="round" opacity="0.4"></path>
  <path d="M 0 0 Q 18 40, 50 65" fill="none" stroke="var(--accent)" stroke-width="0.7" stroke-linecap="round" opacity="0.3"></path>
  <!-- Detailed leaves -->
  <path d="M 30 18 C 34 12, 42 12, 44 18 C 39 23, 31 23, 30 18 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <path d="M 18 30 C 12 34, 12 42, 18 44 C 23 39, 23 31, 18 30 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <path d="M 36 28 C 42 24, 48 26, 48 33 C 42 37, 36 34, 36 28 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <path d="M 28 36 C 24 42, 26 48, 33 48 C 37 42, 34 36, 28 36 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <!-- Leaf buds at tips -->
  <path d="M 52 46 C 58 42, 65 45, 63 53 C 57 56, 50 51, 52 46 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <path d="M 46 52 C 42 58, 45 65, 53 63 C 56 57, 51 50, 46 52 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" stroke-width="0.7"></path>
  <!-- Tiny decorative dots -->
  <circle cx="8" cy="45" r="1.5" fill="var(--accent)" opacity="0.6"></circle>
  <circle cx="45" cy="8" r="1.5" fill="var(--accent)" opacity="0.6"></circle>
  <circle cx="62" cy="62" r="1.8" fill="var(--accent)" opacity="0.6"></circle>
  <circle cx="70" cy="52" r="1.2" fill="var(--accent)" opacity="0.5"></circle>
  <circle cx="52" cy="70" r="1.2" fill="var(--accent)" opacity="0.5"></circle>
</svg>
`;

const WATERMARK_SVG = `
<svg viewBox="0 0 120 120" style="width: 100%; height: 100%; fill: none;">
  <path d="M 10 90 Q 40 50, 70 80 T 110 30" stroke="var(--accent)" stroke-width="0.8" stroke-linecap="round" fill="none"></path>
  <!-- Leaves along the stem -->
  <path d="M 25 70 C 20 60, 30 55, 35 65 Z" fill="var(--accent)" fill-opacity="0.2" stroke="var(--accent)" stroke-width="0.5"></path>
  <path d="M 40 60 C 45 50, 55 52, 50 62 Z" fill="var(--accent)" fill-opacity="0.2" stroke="var(--accent)" stroke-width="0.5"></path>
  <path d="M 58 68 C 65 58, 72 62, 66 70 Z" fill="var(--accent)" fill-opacity="0.2" stroke="var(--accent)" stroke-width="0.5"></path>
  <path d="M 75 70 C 80 60, 90 62, 85 72 Z" fill="var(--accent)" fill-opacity="0.2" stroke="var(--accent)" stroke-width="0.5"></path>
  <path d="M 90 52 C 95 42, 105 45, 100 55 Z" fill="var(--accent)" fill-opacity="0.2" stroke="var(--accent)" stroke-width="0.5"></path>
  <!-- Small buds/flourishes -->
  <circle cx="32" cy="55" r="1" fill="var(--accent)"></circle>
  <circle cx="68" cy="58" r="1" fill="var(--accent)"></circle>
  <circle cx="98" cy="42" r="1.2" fill="var(--accent)"></circle>
</svg>
`;

const CENTER_ORNAMENTS = {
  ribbon: `
    <svg class="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 50 45 C 35 25, 20 38, 35 48 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1.2"></path>
      <path d="M 50 45 C 65 25, 80 38, 65 48 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1.2"></path>
      <path d="M 42 46 C 40 55, 30 68, 25 78" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round" fill="none"></path>
      <path d="M 58 46 C 60 55, 70 68, 75 78" stroke="var(--accent)" stroke-width="1.2" stroke-linecap="round" fill="none"></path>
      <circle cx="50" cy="46" r="4" fill="var(--accent)"></circle>
    </svg>
  `,
  leaf: `
    <svg class="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 50 85 C 50 55, 45 35, 50 15" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" fill="none"></path>
      <path d="M 50 68 C 62 58, 68 48, 62 42 C 54 42, 50 55, 50 68 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 50 52 C 38 42, 32 32, 38 26 C 46 26, 50 39, 50 52 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 50 38 C 62 28, 68 18, 62 12 C 54 12, 50 25, 50 38 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 50 22 C 38 12, 32 2, 38 -4 C 46 -4, 50 9, 50 22 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
    </svg>
  `,
  dove: `
    <svg class="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 30 45 C 38 52, 48 58, 60 53 C 68 49, 72 41, 70 35" fill="none" stroke="var(--accent)" stroke-width="1.2"></path>
      <path d="M 30 45 C 35 35, 45 30, 55 30 C 60 30, 65 33, 70 37 C 73 40, 78 40, 82 37 C 80 43, 76 49, 70 52 C 65 55, 60 57, 55 57 C 45 57, 38 53, 30 45 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 48 41 C 52 25, 65 20, 72 25 C 68 33, 60 38, 52 41 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
    </svg>
  `,
  floral: `
    <svg class="center-ornament-svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="10" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></circle>
      <path d="M 50 22 C 40 32, 40 45, 50 50 C 60 45, 60 32, 50 22 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 50 78 C 40 68, 40 55, 50 50 C 60 55, 60 68, 50 78 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 22 50 C 32 40, 45 40, 50 50 C 45 60, 32 60, 22 50 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <path d="M 78 50 C 68 40, 55 40, 50 50 C 55 60, 68 60, 78 50 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" stroke-width="1"></path>
      <circle cx="50" cy="50" r="3" fill="var(--accent)"></circle>
    </svg>
  `,
};

const FLOURISH_DIVIDER = `
<svg class="flourish-svg" viewBox="0 0 120 10">
  <path d="M 0 5 L 46 5" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.4"></path>
  <path d="M 74 5 L 120 5" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.4"></path>
  <path d="M 46 5 Q 53 -1, 60 5 Q 67 11, 74 5" fill="none" stroke="var(--accent)" stroke-width="0.8" opacity="0.6"></path>
  <polygon points="60,1.5 64,5 60,8.5 56,5" fill="var(--accent)"></polygon>
  <circle cx="48" cy="5" r="1.2" fill="var(--accent)"></circle>
  <circle cx="72" cy="5" r="1.2" fill="var(--accent)"></circle>
</svg>
`;

export function renderInvitationHTML({ fullName, tableNumber, variant, qrDataUrl }) {
  const ornamentHtml = CENTER_ORNAMENTS[variant.ornament] || CENTER_ORNAMENTS.floral;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Quicksand:wght@300;400;500;600&display=swap');

  :root {
    --accent: ${variant.accent_color};
    --accent-light: ${variant.accent_light};
    --accent-light-alpha: ${variant.accent_light}1f; /* ~12% opacity wash */
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 148mm;
    height: 210mm;
    font-family: 'Quicksand', sans-serif;
    background: #fcfbfa;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .card {
    width: 148mm;
    height: 210mm;
    padding: 4mm;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    position: relative;
    border: 1px solid var(--accent);
  }

  .card-border-inner {
    flex: 1;
    height: 100%;
    border: 1px solid var(--accent);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10mm 6mm;
    position: relative;
    box-sizing: border-box;
    /* Soft color wash background: ellipse radial gradient */
    background: 
      radial-gradient(ellipse at center, #ffffff 0%, var(--accent-light-alpha) 100%);
    background-color: #fbfaf6;
  }

  /* Watermark Background Textures */
  .watermark {
    position: absolute;
    width: 70mm;
    height: 70mm;
    opacity: 0.08; /* 8-12% opacity */
    pointer-events: none;
    z-index: 0;
  }
  .watermark-1 {
    top: 12%;
    left: -12mm;
    transform: rotate(15deg);
  }
  .watermark-2 {
    bottom: 12%;
    right: -12mm;
    transform: rotate(195deg) scaleX(-1);
  }

  /* Corner Ornaments - Enlarged and Thicker */
  .corner-svg {
    position: absolute;
    width: 38mm;
    height: 38mm;
    opacity: 0.48; /* 40-55% opacity */
    pointer-events: none;
    z-index: 0;
  }
  .corner-svg.top-left { top: 0; left: 0; }
  .corner-svg.top-right { top: 0; right: 0; transform: scaleX(-1); }
  .corner-svg.bottom-left { bottom: 0; left: 0; transform: scaleY(-1); }
  .corner-svg.bottom-right { bottom: 0; right: 0; transform: scale(-1); }

  /* Content elements raised above watermarks */
  .content-block {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  /* Center Ornament */
  .ornament {
    height: 12mm;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2mm;
  }
  .center-ornament-svg {
    width: 12mm;
    height: 12mm;
  }

  .pre-heading {
    font-size: 12px; /* Increased from 8.5px */
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 2mm;
  }

  .main-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px; /* Increased from 36px */
    font-weight: 300;
    color: #2e3a40;
    line-height: 1.1;
    margin-bottom: 1.5mm;
  }

  .sub-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; /* Increased to 18px */
    font-style: italic;
    color: #6b7680;
    margin-bottom: 4mm;
  }

  .flourish-divider {
    width: 44mm;
    height: 6mm;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3.5mm;
  }
  .flourish-svg {
    width: 100%;
    height: 100%;
  }

  .guest-label {
    font-size: 11px; /* Increased to 8px */
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #8b959c;
    margin-bottom: 2mm;
  }

  .guest-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px; /* Increased from 26px */
    font-weight: 400;
    font-style: italic;
    color: #232c30;
    margin-bottom: 4.5mm;
    padding: 0 4mm;
    text-align: center;
    line-height: 1.2;
  }

  /* Table Badge */
  .table-badge {
    width: 24mm;
    height: 24mm;
    border-radius: 50%;
    border: 1px solid var(--accent);
    background: var(--accent-light);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 4.5mm;
    box-shadow: 0 4px 12px rgba(90,128,144,0.06);
    position: relative;
    z-index: 1;
  }
  .table-badge-inner {
    width: 21mm;
    height: 21mm;
    border-radius: 50%;
    border: 0.8px dashed var(--accent);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .table-badge-label {
    font-size: 11px; /* Increased from 7px */
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.5mm;
    font-weight: 500;
  }
  .table-badge-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px; /* Increased from 26px */
    font-weight: 600;
    color: #2e3a40;
    line-height: 1;
  }

  .event-details {
    font-size: 15px; /* Increased from 10px */
    color: #6b7680;
    line-height: 2.0; /* Increased to 2.0 */
    margin-bottom: 4.5mm;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .event-details strong {
    color: #2e3a40;
    font-weight: 500;
  }

  .qr-code {
    width: 22mm;
    height: 22mm;
    margin-bottom: 1.5mm;
  }

  .qr-hint {
    font-size: 10px; /* Increased from 7px */
    color: #a0a8ac;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="card-border-inner">
      <!-- Watermark Background Textures -->
      <div class="watermark watermark-1">${WATERMARK_SVG}</div>
      <div class="watermark watermark-2">${WATERMARK_SVG}</div>

      <!-- 4 Corner Ornaments -->
      <div class="corner-svg top-left">${CORNER_SVG}</div>
      <div class="corner-svg top-right">${CORNER_SVG}</div>
      <div class="corner-svg bottom-left">${CORNER_SVG}</div>
      <div class="corner-svg bottom-right">${CORNER_SVG}</div>

      <!-- Top Section -->
      <div class="content-block">
        <div class="ornament">${ornamentHtml}</div>
        <div class="pre-heading">A Special Celebration of Life</div>
        <div class="main-heading">Enoch's Dedication</div>
        <div class="sub-heading">Your Seating Details</div>
        <div class="flourish-divider">${FLOURISH_DIVIDER}</div>
      </div>

      <!-- Guest Section -->
      <div class="content-block">
        <div class="guest-label">This Seating Card Is Prepared For</div>
        <div class="guest-name">${escapeHtml(fullName)}</div>
      </div>

      <!-- Table Badge -->
      <div class="table-badge">
        <div class="table-badge-inner">
          <div class="table-badge-label">Table</div>
          <div class="table-badge-number">${tableNumber}</div>
        </div>
      </div>

      <!-- Event Details -->
      <div class="event-details">
        Sunday, July 5th, 2026 — 11:00am<br>
        <strong>RCCG, Livingston Assembly, EH54 6LT</strong><br>
        Dress like an African, or a touch of teal blue
      </div>

      <!-- QR Code Section -->
      <div class="content-block" style="width: auto;">
        <img class="qr-code" src="${qrDataUrl}" />
        <div class="qr-hint">Scan to revisit your seating details</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
