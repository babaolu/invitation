import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, API_BASE } from '../lib/supabaseClient';

export default function SeatingDirectory() {
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [savedStatus, setSavedStatus] = useState({});
  const navigate = useNavigate();

  const tableOptions = Array.from({ length: 18 }, (_, i) => i + 1);

  async function loadDirectory() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/admin'); return; }

    const res = await fetch(`${API_BASE}/api/admin/seating-directory`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    setDirectory(data.directory || []);
    setLoading(false);
  }

  useEffect(() => { loadDirectory(); }, []);

  async function downloadPdf() {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`${API_BASE}/api/admin/seating-directory/pdf`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seating-directory.pdf';
    a.click();
  }

  async function handleTableChange(guestId, newTableNumber) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/admin'); return; }

      const res = await fetch(`${API_BASE}/api/admin/guests/${guestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ table_number: Number(newTableNumber) })
      });

      if (!res.ok) throw new Error('Failed to update table assignment');

      // Update local state table_number so the dropdown reflects the saved state
      setDirectory(prevDir => prevDir.map(tableBlock => ({
        ...tableBlock,
        guests: tableBlock.guests.map(g => {
          if (g.id === guestId) {
            return { ...g, table_number: Number(newTableNumber) };
          }
          return g;
        })
      })));

      // Trigger temporary saved confirmation
      setSavedStatus(prev => ({ ...prev, [guestId]: true }));
      setTimeout(() => {
        setSavedStatus(prev => ({ ...prev, [guestId]: false }));
      }, 2000);

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="dir-wrap">
      <div className="dir-header">
        <h1>Seating Directory</h1>
        <div className="dir-nav">
          <Link to="/admin/guests">Guest Management</Link>
          <button 
            onClick={() => setEditMode(!editMode)} 
            className={`toggle-btn ${editMode ? 'active' : ''}`}
          >
            {editMode ? '✏️ Edit Mode' : '🔒 Read-Only'}
          </button>
          <button onClick={loadDirectory}>🔀 Regenerate</button>
          <button onClick={downloadPdf} className="download">⬇ Download PDF</button>
        </div>
      </div>

      {loading ? (
        <p>Shuffling…</p>
      ) : (
        <div className="dir-grid">
          {directory.map((t) => (
            <div className="table-block" key={t.tableNumber}>
              <div className="table-title">Table {t.tableNumber}</div>
              {t.guests.map((g) => (
                <div className="guest-item" key={g.id}>
                  {editMode ? (
                    <>
                      <span className="guest-name-text">{g.full_name}</span>
                      <select
                        value={g.table_number || t.tableNumber}
                        onChange={(e) => handleTableChange(g.id, e.target.value)}
                        className="table-select"
                      >
                        {tableOptions.map(num => (
                          <option key={num} value={num}>Table {num}</option>
                        ))}
                      </select>
                      {savedStatus[g.id] && <span className="saved-indicator">✓ Saved</span>}
                    </>
                  ) : (
                    <span className="guest-name-text">{g.full_name}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dir-wrap { padding: 32px; font-family: 'Quicksand', sans-serif; background: #f5f4ec; min-height: 100vh; }
        .dir-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .dir-header h1 { font-family: 'Cormorant Garamond', serif; font-weight: 300; color: #2e3a40; }
        .dir-nav { display: flex; gap: 12px; align-items: center; }
        .dir-nav a { color: #7a9aaa; text-decoration: none; font-size: 14px; }
        .dir-nav button { padding: 8px 16px; border: none; border-radius: 20px; background: #eaf2f6; color: #2e3a40; cursor: pointer; font-size: 13px; outline: none; }
        .dir-nav button.download { background: #7a9aaa; color: #fff; }
        
        .dir-nav button.toggle-btn {
          border: 1px solid #c8d9e2;
          transition: all 0.2s;
        }
        .dir-nav button.toggle-btn.active {
          background: #7a9aaa;
          color: #fff;
          border-color: #628292;
        }

        .dir-grid { columns: 3; column-gap: 16px; }
        .table-block {
          break-inside: avoid; background: #fff; border: 1px solid #ddeaf0; border-radius: 8px;
          padding: 14px 16px; margin-bottom: 16px;
        }
        .table-title {
          font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #2e3a40;
          border-bottom: 1px solid #eaf2f6; padding-bottom: 6px; margin-bottom: 8px;
        }
        .guest-item { 
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px; 
          color: #4a6070; 
          padding: 4px 0; 
          gap: 8px;
          min-height: 28px;
        }
        .guest-name-text {
          flex: 1;
          word-break: break-word;
        }
        .table-select {
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #c8d9e2;
          font-family: inherit;
          font-size: 11px;
          color: #2e3a40;
          background: #fff;
          outline: none;
        }
        .saved-indicator {
          font-size: 11px;
          color: #2e7d32;
          font-weight: 500;
          margin-left: 4px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .dir-grid { columns: 2; }
        }
        @media (max-width: 600px) {
          .dir-wrap { padding: 16px; }
          .dir-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .dir-nav { flex-wrap: wrap; width: 100%; gap: 8px; }
          .dir-grid { columns: 1; }
          .guest-item { flex-direction: column; align-items: flex-start; gap: 4px; }
          .table-select { width: 100%; }
        }
      `}</style>
    </div>
  );
}
