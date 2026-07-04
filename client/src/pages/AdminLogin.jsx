import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

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
      // "Invalid path specified in request URL" (or similar fetch/URL errors)
      // means the Supabase URL/key aren't loaded correctly — surface that
      // clearly instead of a raw, confusing error string.
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
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Admin Login</h1>

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

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <style>{`
        .login-wrap {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #f5f4ec; font-family: 'Quicksand', sans-serif;
        }
        .login-card {
          background: #fff; padding: 40px 32px; border-radius: 12px;
          border: 1px solid #ddeaf0; width: 320px; display: flex; flex-direction: column; gap: 14px;
        }
        .login-card h1 {
          font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 26px;
          color: #2e3a40; margin-bottom: 8px; text-align: center;
        }
        .login-card input {
          padding: 10px 14px; border: 1px solid #ddeaf0; border-radius: 6px; font-size: 14px;
          width: 100%;
        }
        .password-field {
          position: relative;
          display: flex;
          align-items: center;
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
        .login-card button[type="submit"] {
          padding: 12px; border: none; border-radius: 30px; background: #7a9aaa;
          color: #fff; font-weight: 500; cursor: pointer; margin-top: 8px;
        }
        .login-card button[type="submit"]:disabled {
          opacity: 0.6; cursor: not-allowed;
        }
        .login-error {
          color: #c66; font-size: 12px; text-align: center; line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
