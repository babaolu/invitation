import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, API_BASE } from '../lib/supabaseClient';

export default function AdminGuests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  
  // Add Guest form state
  const [newFullName, setNewFullName] = useState('');
  const [newTableNumber, setNewTableNumber] = useState('');
  const [formError, setFormError] = useState(null);
  
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

  async function handleAddGuest(e) {
    e.preventDefault();
    setFormError(null);
    if (!newFullName.trim() || !newTableNumber) {
      setFormError('Name and table number are required');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }

      const res = await fetch(`${API_BASE}/api/admin/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          full_name: newFullName.trim(),
          table_number: Number(newTableNumber),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add guest');

      setNewFullName('');
      setNewTableNumber('');
      await loadGuests();
    } catch (err) {
      setFormError(err.message);
    }
  }

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

  async function handleDeleteGuest(guestId, fullName) {
    if (!window.confirm(`Remove ${fullName}? This cannot be undone.`)) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }

      const res = await fetch(`${API_BASE}/api/admin/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete guest');
      }

      await loadGuests();
    } catch (err) {
      alert(err.message);
    }
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

      {/* Add Guest Form */}
      <form onSubmit={handleAddGuest} className="add-guest-form">
        <input
          type="text"
          placeholder="Guest Full Name"
          value={newFullName}
          onChange={(e) => setNewFullName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Table"
          value={newTableNumber}
          onChange={(e) => setNewTableNumber(e.target.value)}
          required
          min="1"
          max="18"
          style={{ width: '80px' }}
        />
        <button type="submit">Add Guest</button>
        {formError && <span className="form-error">{formError}</span>}
      </form>

      <table className="guest-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Table</th>
            <th>Seating Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.id}>
              <td data-label="Name">{g.full_name}</td>
              <td data-label="Table">
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
              <td data-label="Seating Link">
                <a href={`/invite/${g.slug}`} target="_blank" rel="noopener noreferrer">
                  /invite/{g.slug}
                </a>
              </td>
              <td data-label="Actions">
                <button onClick={() => handleDeleteGuest(g.id, g.full_name)} className="delete-btn">
                  Remove
                </button>
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
        .admin-nav button { padding: 8px 16px; border: none; border-radius: 20px; background: #7a9aaa; color: #fff; cursor: pointer; font-family: inherit; font-size: 13px; }
        
        .add-guest-form {
          background: #fff;
          padding: 20px 24px;
          border-radius: 8px;
          border: 1px solid #ddeaf0;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .add-guest-form input {
          padding: 8px 12px;
          border: 1px solid #ddeaf0;
          border-radius: 4px;
          font-family: inherit;
          font-size: 13px;
          outline: none;
        }
        .add-guest-form input:focus {
          border-color: #7a9aaa;
        }
        .add-guest-form input[type="text"] {
          flex: 1;
          min-width: 200px;
        }
        .add-guest-form button {
          padding: 8px 20px;
          border: none;
          border-radius: 20px;
          background: #7a9aaa;
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
        }
        .add-guest-form button:hover {
          background-color: #628292;
        }
        .form-error {
          color: #c66;
          font-size: 12px;
          font-weight: 500;
        }

        .guest-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
        .guest-table th, .guest-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
        .guest-table th { background: #eaf2f6; color: #4a6070; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; }
        .guest-table input { width: 60px; padding: 4px 8px; border: 1px solid #ddeaf0; border-radius: 4px; font-family: inherit; }

        .delete-btn {
          background: #fdf2f2;
          color: #9b1c1c;
          border: 1px solid #f8b4b4;
          padding: 4px 10px;
          border-radius: 12px;
          font-family: inherit;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .delete-btn:hover {
          background: #fde8e8;
          border-color: #f38b8b;
        }

        @media (max-width: 600px) {
          .admin-wrap { padding: 16px; }
          .admin-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .admin-nav { width: 100%; justify-content: space-between; }
          .add-guest-form { flex-direction: column; align-items: stretch; padding: 16px; }
          .add-guest-form input[type="text"] { min-width: 0; }
          .add-guest-form input { width: 100% !important; }
          
          /* Stacked Card Layout on Mobile */
          .guest-table, .guest-table thead, .guest-table tbody, .guest-table tr, .guest-table td {
            display: block;
            width: 100%;
            box-sizing: border-box;
          }
          .guest-table thead {
            display: none;
          }
          .guest-table tr {
            margin-bottom: 16px;
            border: 1px solid #ddeaf0;
            border-radius: 8px;
            background: #fff;
            padding: 12px 16px;
            box-shadow: 0 4px 10px rgba(90,128,144,0.04);
          }
          .guest-table td {
            border: none;
            border-bottom: 1px solid #f6f8fa;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .guest-table td:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .guest-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #4a6070;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .guest-table input {
            text-align: right;
          }
          .guest-table td[data-label="Seating Link"] a {
            word-break: break-all;
            text-align: right;
            max-width: 65%;
          }
        }
      `}</style>
    </div>
  );
}
