// Generates the HTML for a single guest's invitation card.
// Same overall theme for everyone; the accent color/ornament
// changes per table via the design variant passed in.

const ORNAMENTS = {
  ribbon: '🎀',
  leaf: '🌿',
  dove: '🕊️',
  floral: '🌸',
};

export function renderInvitationHTML({ fullName, tableNumber, variant, qrDataUrl }) {
  const ornamentIcon = ORNAMENTS[variant.ornament] || '🌸';

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Quicksand:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 148mm;
    height: 210mm;
    font-family: 'Quicksand', sans-serif;
    background: linear-gradient(160deg, #ffffff 0%, #fbfaf6 50%, #f5f4ec 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14mm 12mm;
  }

  .card {
    width: 100%;
    height: 100%;
    border: 1.5px solid ${variant.accent_color};
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 16mm 10mm;
    background: #ffffff;
    overflow: hidden;
  }

  .ribbon-top, .ribbon-bottom {
    position: absolute;
    left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, ${variant.accent_light}, ${variant.accent_color}, ${variant.accent_light});
  }
  .ribbon-top { top: 0; }
  .ribbon-bottom { bottom: 0; }

  .ornament {
    font-size: 26px;
    margin-bottom: 10px;
    opacity: 0.85;
  }

  .pre-heading {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${variant.accent_color};
    margin-bottom: 14px;
  }

  .main-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    font-weight: 300;
    font-style: italic;
    color: #2e3a40;
    line-height: 1.15;
    margin-bottom: 6px;
  }

  .sub-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-style: italic;
    color: #6b7680;
    margin-bottom: 22px;
  }

  .divider {
    width: 50px;
    height: 1px;
    background: ${variant.accent_color};
    opacity: 0.5;
    margin-bottom: 22px;
  }

  .guest-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #a0a8ac;
    margin-bottom: 6px;
  }

  .guest-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 500;
    color: #2e3a40;
    margin-bottom: 26px;
    padding: 0 10px;
  }

  .table-box {
    border: 1px solid ${variant.accent_color};
    background: ${variant.accent_light};
    border-radius: 6px;
    padding: 14px 30px;
    margin-bottom: 26px;
  }

  .table-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${variant.accent_color};
    margin-bottom: 4px;
  }

  .table-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 400;
    color: #2e3a40;
    line-height: 1;
  }

  .event-details {
    font-size: 11px;
    color: #6b7680;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  .event-details strong {
    color: #2e3a40;
  }

  .qr-code {
    width: 26mm;
    height: 26mm;
    margin-bottom: 8px;
  }

  .qr-hint {
    font-size: 8px;
    color: #a0a8ac;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="ribbon-top"></div>
    <div class="ornament">${ornamentIcon}</div>
    <div class="pre-heading">A Special Celebration of Life</div>
    <div class="main-heading">Enoch's Dedication</div>
    <div class="sub-heading">You're Invited</div>
    <div class="divider"></div>

    <div class="guest-label">This Invitation Belongs To</div>
    <div class="guest-name">${escapeHtml(fullName)}</div>

    <div class="table-box">
      <div class="table-label">Your Table</div>
      <div class="table-number">${tableNumber}</div>
    </div>

    <div class="event-details">
      Sunday, July 5th, 2026 — 11:00am<br>
      <strong>RCCG, Livingston Assembly, EH54 6LT</strong><br>
      Dress like an African, or a touch of teal blue
    </div>

    <img class="qr-code" src="${qrDataUrl}" />
    <div class="qr-hint">Scan to revisit this invitation</div>

    <div class="ribbon-bottom"></div>
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
