import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { API_BASE } from '../lib/supabaseClient';

const CORNER_SVG = (
  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none' }}>
    <path d="M 0 0 C 30 10, 55 20, 65 45 C 48 40, 28 25, 0 0 Z" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeWidth="1.1" />
    <path d="M 0 0 C 10 30, 20 55, 45 65 C 40 48, 25 28, 0 0 Z" fill="var(--accent)" fillOpacity="0.1" stroke="var(--accent)" strokeWidth="1.1" />
    <path d="M 0 0 Q 40 18, 75 75" fill="none" stroke="var(--accent)" strokeWidth="1.0" strokeLinecap="round" opacity="0.4" />
    <path d="M 0 0 Q 18 40, 50 65" fill="none" stroke="var(--accent)" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
    <path d="M 30 18 C 34 12, 42 12, 44 18 C 39 23, 31 23, 30 18 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <path d="M 18 30 C 12 34, 12 42, 18 44 C 23 39, 23 31, 18 30 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <path d="M 36 28 C 42 24, 48 26, 48 33 C 42 37, 36 34, 36 28 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <path d="M 28 36 C 24 42, 26 48, 33 48 C 37 42, 34 36, 28 36 Z" fill="var(--accent)" fill-opacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <path d="M 52 46 C 58 42, 65 45, 63 53 C 57 56, 50 51, 52 46 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <path d="M 46 52 C 42 58, 45 65, 53 63 C 56 57, 51 50, 46 52 Z" fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="0.7" />
    <circle cx="8" cy="45" r="1.5" fill="var(--accent)" opacity="0.6" />
    <circle cx="45" cy="8" r="1.5" fill="var(--accent)" opacity="0.6" />
    <circle cx="62" cy="62" r="1.8" fill="var(--accent)" opacity="0.6" />
    <circle cx="70" cy="52" r="1.2" fill="var(--accent)" opacity="0.5" />
    <circle cx="52" cy="70" r="1.2" fill="var(--accent)" opacity="0.5" />
  </svg>
);

const WATERMARK_SVG = (
  <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', fill: 'none' }}>
    <path d="M 10 90 Q 40 50, 70 80 T 110 30" stroke="var(--accent)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    <path d="M 25 70 C 20 60, 30 55, 35 65 Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
    <path d="M 40 60 C 45 50, 55 52, 50 62 Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
    <path d="M 58 68 C 65 58, 72 62, 66 70 Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
    <path d="M 75 70 C 80 60, 90 62, 85 72 Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
    <path d="M 90 52 C 95 42, 105 45, 100 55 Z" fill="var(--accent)" fillOpacity="0.2" stroke="var(--accent)" strokeWidth="0.5" />
    <circle cx="32" cy="55" r="1" fill="var(--accent)" />
    <circle cx="68" cy="58" r="1" fill="var(--accent)" />
    <circle cx="98" cy="42" r="1.2" fill="var(--accent)" />
  </svg>
);

const CENTER_ORNAMENTS = {
  ribbon: (
    <svg className="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 50 45 C 35 25, 20 38, 35 48 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1.2" />
      <path d="M 50 45 C 65 25, 80 38, 65 48 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1.2" />
      <path d="M 42 46 C 40 55, 30 68, 25 78" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M 58 46 C 60 55, 70 68, 75 78" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="46" r="4" fill="var(--accent)" />
    </svg>
  ),
  leaf: (
    <svg className="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 50 85 C 50 55, 45 35, 50 15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 50 68 C 62 58, 68 48, 62 42 C 54 42, 50 55, 50 68 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 50 52 C 38 42, 32 32, 38 26 C 46 26, 50 39, 50 52 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 50 38 C 62 28, 68 18, 62 12 C 54 12, 50 25, 50 38 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 50 22 C 38 12, 32 2, 38 -4 C 46 -4, 50 9, 50 22 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" stroke-width="1" />
    </svg>
  ),
  dove: (
    <svg className="center-ornament-svg" viewBox="0 0 100 100">
      <path d="M 30 45 C 38 52, 48 58, 60 53 C 68 49, 72 41, 70 35" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
      <path d="M 30 45 C 35 35, 45 30, 55 30 C 60 30, 65 33, 70 37 C 73 40, 78 40, 82 37 C 80 43, 76 49, 70 52 C 65 55, 60 57, 55 57 C 45 57, 38 53, 30 45 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 48 41 C 52 25, 65 20, 72 25 C 68 33, 60 38, 52 41 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
    </svg>
  ),
  floral: (
    <svg className="center-ornament-svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="10" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 50 22 C 40 32, 40 45, 50 50 C 60 45, 60 32, 50 22 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 50 78 C 40 68, 40 55, 50 50 C 60 55, 60 68, 50 78 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 22 50 C 32 40, 45 40, 50 50 C 45 60, 32 60, 22 50 Z" fill="var(--accent-light)" fillOpacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <path d="M 78 50 C 68 40, 55 40, 50 50 C 55 60, 68 60, 78 50 Z" fill="var(--accent-light)" fill-opacity="0.4" stroke="var(--accent)" strokeWidth="1" />
      <circle cx="50" cy="50" r="3" fill="var(--accent)" />
    </svg>
  ),
};

const FLOURISH_DIVIDER = (
  <svg className="flourish-svg" viewBox="0 0 120 10">
    <path d="M 0 5 L 46 5" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
    <path d="M 74 5 L 120 5" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.4" />
    <path d="M 46 5 Q 53 -1, 60 5 Q 67 11, 74 5" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.6" />
    <polygon points="60,1.5 64,5 60,8.5 56,5" fill="var(--accent)" />
    <circle cx="48" cy="5" r="1.2" fill="var(--accent)" />
    <circle cx="72" cy="5" r="1.2" fill="var(--accent)" />
  </svg>
);

export default function InvitePage() {
  const { slug } = useParams();
  const [guest, setGuest] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/invite/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invitation not found');
        return res.json();
      })
      .then(setGuest)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="invite-wrap"><p className="invite-loading">Loading your invitation…</p></div>;
  }

  if (error || !guest) {
    return (
      <div className="invite-wrap">
        <p className="invite-error">We couldn't find that invitation. Please check your link, or contact the family.</p>
      </div>
    );
  }

  const inviteUrl = `${window.location.origin}/invite/${slug}`;
  const pdfUrl = `${API_BASE}/api/invite/${slug}/pdf`;
  const ornamentComponent = CENTER_ORNAMENTS[guest.ornament] || CENTER_ORNAMENTS.floral;

  return (
    <div
      className="invite-wrap"
      style={{
        '--accent': guest.accentColor,
        '--accent-light': guest.accentLight,
        '--accent-light-alpha': `${guest.accentLight}1f`,
      }}
    >
      <div className="invite-container">
        <div className="invite-card">
          <div className="card-border-inner">
            {/* Watermark Background Textures */}
            <div className="watermark watermark-1">{WATERMARK_SVG}</div>
            <div className="watermark watermark-2">{WATERMARK_SVG}</div>

            {/* 4 Corner Ornaments */}
            <div className="corner-svg top-left">{CORNER_SVG}</div>
            <div className="corner-svg top-right">{CORNER_SVG}</div>
            <div className="corner-svg bottom-left">{CORNER_SVG}</div>
            <div className="corner-svg bottom-right">{CORNER_SVG}</div>

            {/* Top Section */}
            <div className="top-section content-block">
              <div className="ornament">{ornamentComponent}</div>
              <div className="pre-heading">A Special Celebration of Life</div>
              <h1 className="main-heading">Enoch's Dedication</h1>
              <p className="sub-heading">You're Invited</p>
              <div className="flourish-divider">{FLOURISH_DIVIDER}</div>
            </div>

            {/* Guest Section */}
            <div className="guest-section content-block">
              <div className="guest-label">This Invitation Belongs To</div>
              <div className="guest-name">{guest.fullName}</div>
            </div>

            {/* Table Badge */}
            <div className="table-badge">
              <div className="table-badge-inner">
                <div className="table-badge-label">Table</div>
                <div className="table-badge-number">{guest.tableNumber}</div>
              </div>
            </div>

            {/* Event Details */}
            <div className="event-details">
              Sunday, July 5th, 2026 — 11:00am<br />
              <strong>RCCG, Livingston Assembly, EH54 6LT</strong><br />
              Dress like an African, or a touch of teal blue
            </div>

            {/* QR Code Section */}
            <div className="qr-section content-block">
              <QRCodeSVG value={inviteUrl} size={84} />
              <p className="qr-hint">Scan to revisit this invitation</p>
            </div>
          </div>
        </div>

        {/* Action Button & Note (rendered elegantly outside the invitation card itself) */}
        <a className="download-btn" href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>

        <p className="reload-note">
          Your table may change before the event — this page and your PDF always show the current assignment.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Quicksand:wght@300;400;500;600&display=swap');

        .invite-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #ffffff 0%, #fbfaf6 50%, #f5f4ec 100%);
          font-family: 'Quicksand', sans-serif;
          padding: 24px 16px;
        }
        .invite-loading, .invite-error {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #4a6070;
          text-align: center;
        }
        .invite-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 440px;
          width: 100%;
        }
        .invite-card {
          position: relative;
          width: 100%;
          background: #ffffff;
          border: 1px solid var(--accent);
          border-radius: 12px;
          padding: 4px;
          display: flex;
          box-shadow: 0 20px 60px rgba(90,128,144,0.08);
          box-sizing: border-box;
          margin-bottom: 24px;
        }
        .card-border-inner {
          flex: 1;
          width: 100%;
          border: 1px solid var(--accent);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 38px 16px;
          position: relative;
          box-sizing: border-box;
          text-align: center;
          min-height: 590px;
          background: 
            radial-gradient(ellipse at center, #ffffff 0%, var(--accent-light-alpha) 100%);
          background-color: #fbfaf6;
        }

        /* Watermarks */
        .watermark {
          position: absolute;
          width: 260px;
          height: 260px;
          opacity: 0.08; /* 8-12% opacity wash */
          pointer-events: none;
          z-index: 0;
        }
        .watermark-1 {
          top: 12%;
          left: -48px;
          transform: rotate(15deg);
        }
        .watermark-2 {
          bottom: 12%;
          right: -48px;
          transform: rotate(195deg) scaleX(-1);
        }

        /* Corner Ornaments - Enlarged and Thicker */
        .corner-svg {
          position: absolute;
          width: 140px;
          height: 140px;
          opacity: 0.48; /* 40-55% opacity */
          pointer-events: none;
          z-index: 0;
        }
        .corner-svg.top-left { top: 0; left: 0; }
        .corner-svg.top-right { top: 0; right: 0; transform: scaleX(-1); }
        .corner-svg.bottom-left { bottom: 0; left: 0; transform: scaleY(-1); }
        .corner-svg.bottom-right { bottom: 0; right: 0; transform: scale(-1); }

        /* Raise Content above Watermark Background */
        .content-block {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Top Section styling */
        .top-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .ornament {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }
        .center-ornament-svg {
          width: 48px;
          height: 48px;
        }
        .pre-heading {
          font-size: 12px; /* Increased to 12px */
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .main-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px; /* Increased to 42px */
          font-weight: 300;
          color: #2e3a40;
          line-height: 1.1;
          margin: 0 0 6px;
        }
        .sub-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; /* Increased to 18px */
          font-style: italic;
          color: #6b7680;
          margin: 0 0 14px;
        }
        .flourish-divider {
          width: 160px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .flourish-svg {
          width: 100%;
          height: 100%;
        }

        /* Guest Section styling */
        .guest-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .guest-label {
          font-size: 11px; /* Increased to 11px */
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8b959c;
          margin-bottom: 6px;
        }
        .guest-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; /* Increased to 32px */
          font-weight: 400;
          font-style: italic;
          color: #232c30;
          margin: 0 0 18px;
          padding: 0 16px;
          line-height: 1.2;
        }

        /* Table Badge */
        .table-badge {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          background: var(--accent-light);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          box-shadow: 0 4px 12px rgba(90,128,144,0.06);
          position: relative;
          z-index: 1;
        }
        .table-badge-inner {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          border: 0.8px dashed var(--accent);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .table-badge-label {
          font-size: 11px; /* Increased to 11px */
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 2px;
          font-weight: 500;
        }
        .table-badge-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px; /* Increased to 30px */
          font-weight: 600;
          color: #2e3a40;
          line-height: 1;
        }

        .event-details {
          font-size: 15px; /* Increased to 15px */
          color: #6b7680;
          line-height: 2.0; /* Increased to 2.0 */
          margin-bottom: 18px;
          position: relative;
          z-index: 1;
        }
        .event-details strong {
          color: #2e3a40;
          font-weight: 500;
        }
        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .qr-hint {
          font-size: 10px; /* Increased to 10px */
          color: #a0a8ac;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 6px 0 0;
        }

        .download-btn {
          display: inline-block;
          padding: 12px 40px;
          border-radius: 30px;
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.06em;
          font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(90,128,144,0.15);
        }
        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(90,128,144,0.25);
        }
        .reload-note {
          font-size: 10px;
          color: #a0a8ac;
          margin-top: 16px;
          line-height: 1.6;
          text-align: center;
          max-width: 320px;
        }
      `}</style>
    </div>
  );
}
