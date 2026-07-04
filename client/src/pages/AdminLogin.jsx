import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const CORNER_SVG = (
  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none' }}>
    <path d="M 0 0 C 30 10, 55 20, 65 45 C 48 40, 28 25, 0 0 Z" fill="#7a9aaa" fillOpacity="0.1" stroke="#7a9aaa" strokeWidth="1.1" />
    <path d="M 0 0 C 10 30, 20 55, 45 65 C 40 48, 25 28, 0 0 Z" fill="#7a9aaa" fillOpacity="0.1" stroke="#7a9aaa" strokeWidth="1.1" />
    <path d="M 0 0 Q 40 18, 75 75" fill="none" stroke="#7a9aaa" strokeWidth="1.0" strokeLinecap="round" opacity="0.4" />
    <path d="M 0 0 Q 18 40, 50 65" fill="none" stroke="#7a9aaa" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
    <path d="M 30 18 C 34 12, 42 12, 44 18 C 39 23, 31 23, 30 18 Z" fill="#7a9aaa" fillOpacity="0.18" stroke="#7a9aaa" strokeWidth="0.7" />
    <path d="M 18 30 C 12 34, 12 42, 18 44 C 23 39, 23 31, 18 30 Z" fill="#7a9aaa" fillOpacity="0.18" stroke="#7a9aaa" strokeWidth="0.7" />
    <circle cx="8" cy="45" r="1.5" fill="#7a9aaa" opacity="0.6" />
    <circle cx="45" cy="8" r="1.5" fill="#7a9aaa" opacity="0.6" />
    <circle cx="62" cy="62" r="1.8" fill="#7a9aaa" opacity="0.6" />
  </svg>
);

const DOVE_SVG = (
  <svg viewBox="0 0 100 100" style={{ width: '48px', height: '48px', margin: '0 auto' }}>
    <path d="M 30 45 C 38 52, 48 58, 60 53 C 68 49, 72 41, 70 35" fill="none" stroke="#7a9aaa" strokeWidth="1.2" />
    <path d="M 30 45 C 35 35, 45 30, 55 30 C 60 30, 65 33, 70 37 C 73 40, 78 40, 82 37 C 80 43, 76 49, 70 52 C 65 55, 60 57, 55 57 C 45 57, 38 53, 30 45 Z" fill="#ddeaf0" fillOpacity="0.4" stroke="#7a9aaa" strokeWidth="1" />
    <path d="M 48 41 C 52 25, 65 20, 72 25 C 68 33, 60 38, 52 41 Z" fill="#ddeaf0" fillOpacity="0.4" stroke="#7a9aaa" strokeWidth="1" />
  </svg>
);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/guests');
    } catch (err) {
      const msg = err?.message || String(err);
      if (/invalid.*url|invalid.*path|failed to fetch/i.test(msg)) {
        setError(
          'Could not reach the login server. Check that client/.env has a valid ' +
          'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
        );
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-wrap">
      {/* Corner Ornaments */}
      <div className="corner-svg top-left">{CORNER_SVG}</div>
      <div className="corner-svg bottom-right">{CORNER_SVG}</div>

      <div className="login-container">
        {/* Elegant Heading Above Login Card */}
        <div className="login-header">
          <div className="login-logo">{DOVE_SVG}</div>
          <h2 className="login-title">Enoch's Dedication</h2>
          <span className="login-subtitle">Admin Access</span>
        </div>

        <form className="login-card" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-submit-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Quicksand:wght@300;400;500;600&display=swap');

        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #ffffff 0%, #fbfaf6 50%, #f5f4ec 100%);
          font-family: 'Quicksand', sans-serif;
          position: relative;
          padding: 24px 16px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Faint Background Corners */
        .corner-svg {
          position: absolute;
          width: 280px;
          height: 280px;
          opacity: 0.08; /* 6-10% opacity */
          pointer-events: none;
          z-index: 0;
        }
        .corner-svg.top-left {
          top: -30px;
          left: -30px;
        }
        .corner-svg.bottom-right {
          bottom: -30px;
          right: -30px;
          transform: scale(-1);
        }

        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Heading Above Card */
        .login-header {
          text-align: center;
          margin-bottom: 24px;
          width: 100%;
        }
        .login-logo {
          margin-bottom: 8px;
        }
        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          font-style: italic;
          color: #2e3a40;
          margin: 0 0 4px;
        }
        .login-subtitle {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #7a9aaa;
          font-weight: 600;
        }

        /* Card with Top Accent Gradient Border & Soft Shadow */
        .login-card {
          background: #fff;
          padding: 48px 36px;
          border-radius: 12px;
          border: 1px solid #ddeaf0;
          border-top: 4px solid #7a9aaa;
          box-shadow: 0 20px 60px rgba(90,128,144,0.12);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-sizing: border-box;
        }

        .login-card input {
          padding: 12px 14px;
          border: 1px solid #ddeaf0;
          border-radius: 6px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          font-family: inherit;
        }
        .login-card input:focus {
          border-color: #7a9aaa;
        }

        .password-field {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }
        .password-field input {
          padding-right: 42px;
        }
        .toggle-visibility {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 4px;
          margin: 0;
          cursor: pointer;
          color: #a0a8ac;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }
        .toggle-visibility:hover {
          color: #7a9aaa;
        }

        .login-submit-btn {
          padding: 12px;
          border: none;
          border-radius: 30px;
          background: #7a9aaa;
          color: #fff;
          font-weight: 500;
          cursor: pointer;
          margin-top: 8px;
          font-family: inherit;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .login-submit-btn:hover:not(:disabled) {
          background-color: #628292;
        }
        .login-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-error {
          color: #c66;
          font-size: 12px;
          text-align: center;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 600px) {
          .login-card {
            padding: 36px 24px;
          }
          .corner-svg {
            width: 180px;
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}
