import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { API_BASE } from '../lib/supabaseClient';

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

  return (
    <div
      className="invite-wrap"
      style={{ '--accent': guest.accentColor, '--accent-light': guest.accentLight }}
    >
      <div className="invite-card">
        <div className="ribbon-top" />
        <div className="ornament">
          {guest.ornament === 'ribbon' && '🎀'}
          {guest.ornament === 'leaf' && '🌿'}
          {guest.ornament === 'dove' && '🕊️'}
          {guest.ornament === 'floral' && '🌸'}
        </div>
        <div className="pre-heading">A Special Celebration of Life</div>
        <h1 className="main-heading">Enoch's Dedication</h1>
        <p className="sub-heading">You're Invited</p>
        <div className="divider" />

        <div className="guest-label">This Invitation Belongs To</div>
        <div className="guest-name">{guest.fullName}</div>

        <div className="table-box">
          <div className="table-label">Your Table</div>
          <div className="table-number">{guest.tableNumber}</div>
        </div>

        <div className="event-details">
          Sunday, July 5th, 2026 — 11:00am<br />
          <strong>RCCG, Livingston Assembly, EH54 6LT</strong><br />
          Dress like an African, or a touch of teal blue
        </div>

        <QRCodeSVG value={inviteUrl} size={90} />
        <p className="qr-hint">Scan to revisit this invitation</p>

        <a className="download-btn" href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>

        <p className="reload-note">
          Your table may change before the event — this page and your PDF always show the current assignment.
        </p>
        <div className="ribbon-bottom" />
      </div>

      <style>{`
        .invite-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #ffffff 0%, #fbfaf6 50%, #f5f4ec 100%);
          font-family: 'Quicksand', sans-serif;
          padding: 24px;
        }
        .invite-loading, .invite-error {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #4a6070;
          text-align: center;
        }
        .invite-card {
          position: relative;
          max-width: 420px;
          width: 100%;
          background: #ffffff;
          border: 1.5px solid var(--accent);
          border-radius: 12px;
          padding: 40px 32px;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(90,128,144,0.1);
        }
        .ribbon-top, .ribbon-bottom {
          position: absolute; left: 0; right: 0; height: 5px;
          background: linear-gradient(90deg, var(--accent-light), var(--accent), var(--accent-light));
        }
        .ribbon-top { top: 0; }
        .ribbon-bottom { bottom: 0; }
        .ornament { font-size: 32px; margin-bottom: 10px; }
        .pre-heading {
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px;
        }
        .main-heading {
          font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300;
          font-style: italic; color: #2e3a40; margin-bottom: 4px;
        }
        .sub-heading {
          font-family: 'Cormorant Garamond', serif; font-size: 16px;
          font-style: italic; color: #6b7680; margin-bottom: 22px;
        }
        .divider { width: 50px; height: 1px; background: var(--accent); opacity: 0.5; margin: 0 auto 22px; }
        .guest-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #a0a8ac; margin-bottom: 6px; }
        .guest-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 500; color: #2e3a40; margin-bottom: 26px; }
        .table-box {
          display: inline-block; border: 1px solid var(--accent); background: var(--accent-light);
          border-radius: 8px; padding: 14px 34px; margin-bottom: 26px;
        }
        .table-label { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); margin-bottom: 4px; }
        .table-number { font-family: 'Cormorant Garamond', serif; font-size: 44px; color: #2e3a40; line-height: 1; }
        .event-details { font-size: 12px; color: #6b7680; line-height: 1.9; margin-bottom: 24px; }
        .event-details strong { color: #2e3a40; }
        .qr-hint { font-size: 9px; color: #a0a8ac; letter-spacing: 0.1em; text-transform: uppercase; margin: 8px 0 20px; }
        .download-btn {
          display: inline-block; padding: 12px 32px; border-radius: 30px;
          background: var(--accent); color: #fff; text-decoration: none;
          font-size: 13px; letter-spacing: 0.06em; font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(90,128,144,0.25); }
        .reload-note { font-size: 10px; color: #a0a8ac; margin-top: 18px; line-height: 1.6; }
      `}</style>
    </div>
  );
}
