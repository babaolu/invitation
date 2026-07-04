import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    navigate('/admin/guests');
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Sign In</button>
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
        }
        .login-card button {
          padding: 12px; border: none; border-radius: 30px; background: #7a9aaa;
          color: #fff; font-weight: 500; cursor: pointer; margin-top: 8px;
        }
        .login-error { color: #c66; font-size: 12px; text-align: center; }
      `}</style>
    </div>
  );
}
