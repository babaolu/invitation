import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, API_BASE } from '../lib/supabaseClient';

export default function AdminGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const navigate = useNavigate();

  async function loadGuests() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/admin'); return; }

    const res = await fetch(`${API_BASE}/api/admin/guests`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setGuests(data.guests || []);
    setLoading(false);
  }

  useEffect(() => { loadGuests(); }, []);

  async function updateTable(guestId, newTable) {
    setSavingId(guestId);
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`${API_BASE}/api/admin/guests/${guestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ table_number: Number(newTable) }),
    });
    await loadGuests();
    setSavingId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin');
  }

  if (loading) return <p style={{ padding: 40 }}>Loading guests…</p>;

  return (
    <div className="admin-wrap">
      <div className="admin-header">
        <h1>Guest Management</h1>
        <div className="admin-nav">
          <Link to="/admin/seating-directory">Seating Directory</Link>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <table className="guest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Table</th>
            <th>Seating Link</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td>{g.full_name}</td>
              <td>
                <input
                  type="number"
                  defaultValue={g.table_number}
                  disabled={savingId === g.id}
                  onBlur={(e) => {
                    if (Number(e.target.value) !== g.table_number) {
                      updateTable(g.id, e.target.value);
                    }
                  }}
                />
              </td>
              <td>
                <a href={`/invite/${g.slug}`} target="_blank" rel="noopener noreferrer">
                  /invite/{g.slug}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .admin-wrap { padding: 32px; font-family: 'Quicksand', sans-serif; background: #f5f4ec; min-height: 100vh; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .admin-header h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #2e3a40; }
        .admin-nav { display: flex; gap: 16px; align-items: center; }
        .admin-nav a { color: #7a9aaa; text-decoration: none; font-size: 14px; }
        .admin-nav button { padding: 8px 16px; border: none; border-radius: 20px; background: #7a9aaa; color: #fff; cursor: pointer; }
        .guest-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
        .guest-table th, .guest-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
        .guest-table th { background: #eaf2f6; color: #4a6070; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; }
        .guest-table input { width: 60px; padding: 4px 8px; border: 1px solid #ddeaf0; border-radius: 4px; }
      `}</style>
    </div>
  );
}
